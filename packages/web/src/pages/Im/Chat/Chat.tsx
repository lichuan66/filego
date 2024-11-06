import React, { useContext, useEffect, useState } from "react";
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
import { ShowUserOrGroupInfoContext } from "../../../context";
import { GroupMember } from "../../../types/user";
import GroupManagePanel from "./GroupManagePanel";

export default function Chat() {
  const focusId = useFocus();
  const linkmans = useLinkmans();
  const selfId = useSelfId();
  const linkman = linkmans[focusId];
  const context = useContext(ShowUserOrGroupInfoContext);
  const [groupManagePanel, setGroupManagerPanel] = useState(false);

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

  async function handleClickFunction() {
    if (linkman.type === "group") {
      let onlineMembers: GroupMember[] | { cache: true } = [];
      onlineMembers = await getGroupOnlineMembers(focusId);
      if (Array.isArray(onlineMembers)) {
        setLinkmanProperty(focusId, "onlineMembers", onlineMembers);
      }
      setGroupManagerPanel(true);
    } else {
      // @ts-ignore
      context.showUserInfo(linkman);
    }
  }

  function handleBodyClick(e: MouseEvent) {
    const { currentTarget } = e;
    let target = e.target as HTMLDivElement;

    do {
      if (target.getAttribute("data-float-panel") === "true") {
        return;
      }
      // @ts-ignore
      target = target.parentElement;
    } while (target && target !== currentTarget);
    setGroupManagerPanel(false);
  }

  useEffect(() => {
    if (!linkman) {
      return () => {};
    }
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

  useEffect(() => {
    document.body.addEventListener("click", handleBodyClick, false);
    return () => {
      document.body.removeEventListener("click", handleBodyClick, false);
    };
  }, []);

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
            onClickFunction={handleClickFunction}
          />
          <MessageList />
          <ChatInput />
          {linkman.type === "group" && (
            <GroupManagePanel
              visible={groupManagePanel}
              onClose={() => setGroupManagerPanel(false)}
              creator={linkman.creator}
              avatar={linkman.avatar}
              groupId={linkman._id}
              onlineMembers={linkman.onlineMembers}
            />
          )}
        </div>
      )}
    </div>
  );
}
