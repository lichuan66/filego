import React from "react";
import { useLinkmans } from "../../../hook/useUser";
import type { Linkman } from "../../../types/user";
import LinkmanComponent from "./Linkman";

export default function LinkmanList() {
  const list = [1, 2, 34, 5, 6, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const linkmans = useLinkmans();

  function renderLinkman(linkman: Linkman) {
    const messages = Object.values(linkman.messages);
    const lastMessage =
      messages.length > 0 ? messages[messages.length - 1] : null;
    let time = new Date(linkman.createTime);
    let preview = "暂无消息";
    if (lastMessage) {
      time = new Date(lastMessage.createTime);
      const { type } = lastMessage;
      preview = type === "text" ? `${lastMessage.content}` : `[${type}]`;
      if (linkman.type === "group") {
        preview = `${lastMessage.from.username}: ${preview}`;
      }
    }
    return (
      <LinkmanComponent
        key={linkman._id}
        id={linkman._id}
        name={linkman.name}
        avatar={linkman.avatar}
        preview={preview}
        unread={linkman.unread}
        time={time}
      />
    );
  }

  return (
    <div className="w-full">
      {Object.values(linkmans).map((elem) => {
        return renderLinkman(elem as Linkman);
      })}
    </div>
  );
}
