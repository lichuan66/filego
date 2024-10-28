import React, { useEffect, useRef, useState } from "react";
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

  const [divWidth, setDivWidth] = useState(0);

  const divRef = useRef<HTMLDivElement>(null);

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
        maxContent={`${divWidth}px`}
        type={message.type}
        percent={message.percent}
      />
    );
  }

  function handleResize() {
    requestAnimationFrame(() => {
      // @ts-ignore
      const height = divRef.current.clientWidth - 200;
      if (height) {
        setDivWidth(height);
      }
    });
  }

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    // 清理函数，移除监听器
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full flex-auto overflow-hidden" ref={divRef}>
      <div className="w-full h-full px-2 py-5 overflow-x-hidden overflow-y-auto">
        {Object.values(messages).map((message) => {
          return renderMessage(message);
        })}
      </div>
    </div>
  );
}
