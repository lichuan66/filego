import React, { useEffect } from "react";
import NoChat from "../../../components/NoChat";
import HeaderBar from "./HeadBar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useLinkmans, useFocus } from "../../../hook/useUser";
import { getGroupOnlineMembers } from "../../../api/service";
import useAction from "../../../hook/useAction";

export default function Chat() {
  const focusId = useFocus();
  const linkmans = useLinkmans();
  const linkman = linkmans[focusId];

  const { setLinkmanProperty } = useAction();

  async function fetchGroupOnlineMembers() {
    let onlineMembers = [];
    onlineMembers = await getGroupOnlineMembers(focusId);
    if (Array.isArray(onlineMembers)) {
      setLinkmanProperty(focusId, "onlineMembers", onlineMembers);
    }
  }

  useEffect(() => {
    if (!linkman) {
      return () => {};
    }
    const request = fetchGroupOnlineMembers;
    request();
    const timer = setInterval(() => {
      request();
    }, 1000 * 60);
    return () => {
      clearInterval(timer);
    };
  }, [focusId]);

  return (
    <div className="w-full h-full">
      {!focusId && <NoChat />}
      {focusId && (
        <div className="w-full h-full flex flex-col bg-[#f7f9fc]">
          <HeaderBar
            id={linkman.id}
            name={linkman.name}
            type={linkman.type}
            onlineMembersCount={linkman.onlineMembers?.length}
          />
          <MessageList />
          <ChatInput />
        </div>
      )}
    </div>
  );
}
