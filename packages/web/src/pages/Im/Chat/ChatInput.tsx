import React, { useRef, useState } from "react";
import IconButton from "../../../components/IconButton";
import {
  useFocus,
  useStore,
  useUsername,
  useSelfId,
  useAvatar,
} from "../../../hook/useUser";
import useAction from "../../../hook/useAction";
import { sendMessage, uploadFile } from "../../../api/service";
import Dropdown from "rc-dropdown";
import Expression from "./Expression";
import { Menu, MenuItem } from "../../../components/Menu";
import readDiskFile, { ReadFileResult } from "../../../lib/readDiskFile";
import config from "@filego/config/client";
import Message from "../../../components/Message";
import { uploadMessageFile } from "../../../api/service";

export default function ChatInput() {
  const focusId = useFocus();
  const selfId = useSelfId() as string;
  const username = useUsername() as string;
  const avatar = useAvatar() as string;
  const { addLinkmanMessage, deleteMessage, updateMessage } = useAction();

  const [expressionDialog, setExpressionDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addSelfMessage(type: string, content: string) {
    const _id = focusId + Date.now();
    const message = {
      _id,
      type,
      content,
      createTime: Date.now(),
      from: {
        _id: selfId,
        username,
        avatar,
        tag: "",
        originUsername: "",
      },
      loading: true,
      percent: type === "image" || type === "file" ? 0 : 100,
    };

    addLinkmanMessage(focusId, message);
    return _id;
  }

  async function handleSendMessage(
    localId: string,
    type: string,
    content: string,
    linkmanId = focusId
  ) {
    const [err, message] = await sendMessage(linkmanId, type, content);
    if (err) {
      deleteMessage(linkmanId, localId);
    } else {
      message.loading = false;
      updateMessage(linkmanId, localId, message);
    }
  }

  function sendTextMessage() {
    // @ts-ignore
    const message = inputRef.current.value.trim();
    if (message.length === 0) {
      return null;
    }

    const id = addSelfMessage("text", message);
    handleSendMessage(id, "text", message);

    // @ts-ignore
    inputRef.current.value = "";
    return null;
  }

  function handleInputKeyDown(e: any) {
    if (e.key === "Enter") {
      sendTextMessage();
    }
  }

  function sendImageMessage(image: string): void;
  function sendImageMessage(image: ReadFileResult): void;
  function sendImageMessage(image: string | ReadFileResult) {
    if (typeof image === "string") {
      return;
    }

    if (image.length > config.maxImageSize) {
      Message.warning("要发送的图片过大");
      return;
    }

    const ext = image.ext.split("/").pop()?.toLowerCase();
    // @ts-ignore
    const url = URL.createObjectURL(image.result);

    console.log("url ===>", url);

    const img = new Image();
    img.src = url;
    img.onload = async () => {
      const id = addSelfMessage("image", `${url}`);
      try {
        const formData = new FormData();
        formData.append("file", image.result as Blob);
        formData.append(
          "fileName",
          `ImageMessage/${selfId}_${Date.now()}.${ext}`
        );
        const imageUrl = await uploadMessageFile(formData);
        handleSendMessage(id, "image", `${imageUrl}`, focusId);
      } catch (error) {
        console.error(error);
        Message.error("上传图片失败");
      }
    };
    img.onerror = (error) => {
      console.log(error);
    };
  }

  async function sendFileMessage(file: ReadFileResult) {
    if (file.length > config.maxFileSize) {
      Message.warning("要发送的文件过大", 3);
      return;
    }

    const id = addSelfMessage(
      "file",
      JSON.stringify({
        filename: file.filename,
        size: file.length,
        ext: file.ext,
      })
    );

    try {
      const formData = new FormData();
      formData.append("file", file.result as Blob);
      formData.append(
        "fileName",
        `FileMessage/${selfId}_${Date.now()}.${file.ext}`
      );
      const fileUrl = await uploadMessageFile(formData);
      handleSendMessage(
        id,
        "file",
        JSON.stringify({
          fileUrl,
          filename: file.filename,
          size: file.length,
          ext: file.ext,
        }),
        focusId
      );
    } catch (error) {
      console.error(error);
      Message.error("上传文件失败");
    }
  }

  async function handleSendImage() {
    const image = await readDiskFile("blob", "image/png,image/jpeg,image/gif");
    if (!image) {
      return null;
    }
    console.log(image);
    sendImageMessage(image);
    return null;
  }

  async function handleSendFile() {
    const file = await readDiskFile("blob");
    if (!file) {
      return;
    }
    sendFileMessage(file);
  }

  function handleFeatureMenuClick({
    key,
    domEvent,
  }: {
    key: string;
    domEvent: any;
  }) {
    switch (key) {
      case "image":
        handleSendImage();
        break;
      case "file":
        handleSendFile();
      default:
        break;
    }
  }

  /**
   * 插入文本到输入框光标处
   * @param value 要插入的文本
   */
  function insertAtCursor(value: string) {
    const input = inputRef.current as unknown as HTMLInputElement;
    if (input.selectionStart || input.selectionStart === 0) {
      const startPos = input.selectionStart;
      const endPos = input.selectionEnd;
      const restoreTop = input.scrollTop;
      input.value =
        input.value.substring(0, startPos) +
        value +
        input.value.substring(endPos as number, input.value.length);
      if (restoreTop > 0) {
        input.scrollTop = restoreTop;
      }
      input.focus();
      input.selectionStart = startPos + value.length;
      input.selectionEnd = startPos + value.length;
    } else {
      input.value += value;
      input.focus();
    }
  }

  function handleSelectExpression(expression: string) {
    setExpressionDialog(false);
    insertAtCursor(`#(${expression})`);
  }

  return (
    <div className="w-full h-[70px] flex flex-row items-center px-4 gap-2 border-t">
      <Dropdown
        trigger={["click"]}
        visible={expressionDialog}
        onVisibleChange={setExpressionDialog}
        overlay={
          <div className="w-[415px] h-[242px] bg-white translate-y-[-7px]">
            <Expression onSelectText={handleSelectExpression} />
          </div>
        }
      >
        <IconButton
          icon={"xiaolian-copy"}
          iconSize={34}
          width={34}
          height={34}
          iconColor="#60a5fa"
          className="cursor-pointer  opacity-100 hover:opacity-40"
        />
      </Dropdown>
      <Dropdown
        trigger={["click"]}
        overlay={
          <div>
            <Menu onClick={handleFeatureMenuClick}>
              <MenuItem key="image">
                <div className="px-3 py-2 cursor-pointer">发送图片</div>
              </MenuItem>
              <MenuItem key="file">
                <div className="px-3 py-2 cursor-pointer">发送文件</div>
              </MenuItem>
              <MenuItem key="code">
                <div className="px-3 py-2 cursor-pointer">发送代码</div>
              </MenuItem>
            </Menu>
          </div>
        }
      >
        <IconButton
          icon={"caidan2"}
          iconSize={32}
          width={32}
          height={32}
          iconColor="#60a5fa"
          className="cursor-pointer  opacity-100 hover:opacity-40"
        />
      </Dropdown>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex-auto flex justify-center items-center w-[100%]"
      >
        <input
          placeholder="开启聊天"
          onChange={() => {}}
          className="w-full border border-slate-300 px-2 py-1"
          ref={inputRef}
          type="text"
          onKeyDown={handleInputKeyDown}
        />
      </form>
      <IconButton
        icon={"mn_fasong_fill"}
        iconSize={32}
        width={32}
        height={32}
        iconColor="#60a5fa"
        className="cursor-pointer  opacity-100 hover:opacity-40"
        onClick={sendTextMessage}
      />
    </div>
  );
}
