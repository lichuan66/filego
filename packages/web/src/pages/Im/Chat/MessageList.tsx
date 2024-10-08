import React from "react";
import useAction from "../../../hook/useAction";
import { useFocus, useSelfId, useLinkmans } from "../../../hook/useUser";
import { Message } from "../../../types/user";
import MessageComponent from "./Message/Message";

export default function MessageList() {
  const focusId = useFocus();
  const selfId = useSelfId();
  const linkmans = useLinkmans();
  const linkman = linkmans[focusId];
  const isGroup = linkman.type === "group";
  const messages = linkman.messages as Message;
  const unread = linkman.unread;

  console.log("messages ===>", messages);

  function renderMessage(message: Message) {
    const isSelf = selfId === message.from._id;

    return (
      <MessageComponent
        key={message._id}
        id={message._id}
        linkmanId={focusId}
        isSelf={isSelf}
        userId={message.from._id}
        avatar={message.from.avatar}
        time={message.createTime}
        username={message.from.username}
        content={message.content}
      />
    );
  }

  return (
    <div className="w-full flex-auto">
      {Object.values(messages).map((message) => {
        return renderMessage(message);
      })}
    </div>
  );
}
