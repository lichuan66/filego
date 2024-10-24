import React, { useEffect } from "react";
import NoChat from "../../../components/NoChat";
import HeaderBar from "./HeadBar";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useLinkmans, useFocus, useSelfId } from "../../../hook/useUser";
import {
  getGroupOnlineMembers,
  getUserOnlineStatus,
} from "../../../api/service";
import useAction from "../../../hook/useAction";

export default function Chat() {
  const focusId = useFocus();
  const linkmans = useLinkmans();
  const selfId = useSelfId();
  const linkman = linkmans[focusId];

  const { setLinkmanProperty } = useAction();

  async function fetchGroupOnlineMembers() {
    let onlineMembers = [];
    onlineMembers = await getGroupOnlineMembers(focusId);
    if (Array.isArray(onlineMembers)) {
      setLinkmanProperty(focusId, "onlineMembers", onlineMembers);
    }
  }

  async function fetchUserOnlineStatus() {
    const isOnline = await getUserOnlineStatus(focusId.replace(selfId, ""));
    setLinkmanProperty(focusId, "isOnline", isOnline);
  }

  useEffect(() => {
    if (!linkman) {
      return () => {};
    }
    console.log("linkman ===>", linkman);

    const request =
      linkman.type === "group"
        ? fetchGroupOnlineMembers
        : fetchUserOnlineStatus;
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
            id={linkman._id}
            name={linkman.name}
            type={linkman.type}
            onlineMembersCount={linkman.onlineMembers?.length}
            isOnline={linkman.isOnline}
          />
          <MessageList />
          <ChatInput />
        </div>
      )}
    </div>
  );
}
