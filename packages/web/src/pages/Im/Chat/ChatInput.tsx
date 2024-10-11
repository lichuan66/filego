import React, { useRef } from "react";
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

export default function ChatInput() {
  const expressIcons = require("../../../assets/icons/express.svg");
  const featureIcons = require("../../../assets/icons/feature.svg");
  const sendIcons = require("../../../assets/icons/send.svg");

  const inputRef = useRef<HTMLInputElement>(null);
  const focusId = useFocus();
  const selfId = useSelfId() as string;
  const username = useUsername() as string;
  const avatar = useAvatar() as string;
  const { addLinkmanMessage, deleteMessage, updateMessage } = useAction();

  function addSelfMessage(type: string, content: string) {
    const _id = focusId + Date.now();
    const message = {
      _id,
      type,
      content,
      createTime: new Date(),
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

  return (
    <div className="w-full h-[70px] flex flex-row items-center px-4 gap-2 border-t">
      <IconButton
        icon={expressIcons}
        iconSize={38}
        width={38}
        height={38}
        className="cursor-pointer  opacity-100 hover:opacity-40"
      />
      <IconButton
        icon={featureIcons}
        iconSize={38}
        width={38}
        height={38}
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
        icon={sendIcons}
        iconSize={38}
        width={38}
        height={38}
        className="cursor-pointer  opacity-100 hover:opacity-40"
      />
    </div>
  );
}
