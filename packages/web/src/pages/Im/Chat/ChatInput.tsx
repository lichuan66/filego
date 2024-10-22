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
import { sendMessage } from "../../../api/service";
import Dropdown from "rc-dropdown";
import Expression from "./Expression";

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
      <IconButton
        icon={"caidan2"}
        iconSize={32}
        width={32}
        height={32}
        iconColor="#60a5fa"
        className="cursor-pointer  opacity-100 hover:opacity-40"
      />
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
