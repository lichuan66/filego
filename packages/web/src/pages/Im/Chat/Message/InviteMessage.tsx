import React from "react";
import useAction from "../../../../hook/useAction";
import Message from "../../../../components/Message";
import { getLinkmanHistoryMessages } from "../../../../api/service";
import { joinGroup } from "../../../../api/service";

interface InviteMessageProps {
  inviteInfo: string;
}

export default function InviteMessage(props: InviteMessageProps) {
  const { inviteInfo } = props;

  const { addLinkman, addLinkmanHistoryMessages } = useAction();

  const invite = JSON.parse(inviteInfo);

  async function handleJoinGroup() {
    const group = await joinGroup(invite.group);

    if (group) {
      group.type = "group";
      addLinkman(group, true);
      Message.success("加入群组成功");
      const messages = await getLinkmanHistoryMessages(invite.group, 0);
      if (messages) {
        addLinkmanHistoryMessages(invite.group, messages);
      }
    }
  }

  return (
    <div
      className="w-[160px] px-1 cursor-pointer text-center"
      onClick={handleJoinGroup}
    >
      <div className="flex border-b border-solid border-[#eee] items-center">
        <span>
          &quot;{invite.inviterName}&quot;邀请你加入群组「
          {invite.groupName}」
        </span>
      </div>
      <p className="inline-block text-[12px] text-center mt-1.5">加入</p>
    </div>
  );
}
