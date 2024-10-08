import React from "react";
import { ShowUserOrGroupInfoContext } from "../../../../context";
import Avatar from "../../../../components/Avatar";
import Time from "../../../../../../utils/time";
import config from "@filego/config/client";

interface PropsType {
  id: string;
  linkmanId: string;
  isSelf: boolean;
  userId: string;
  avatar: string;
  username: string;
  time: string;
  content: string;
}

export default function Message(props: PropsType) {
  const { isSelf, avatar, username, time, content } = props;

  //   const newAvatar = require(avatar);

  const isSelfClassName = `
    flex flex-row-reverse
  `;

  function formatTime() {
    const messageTime = new Date(Number(time));
    const nowTime = new Date();

    if (Time.isToday(nowTime, messageTime)) {
      return Time.getHourMinute(messageTime);
    }
    if (Time.isYesterday(nowTime, messageTime)) {
      return `昨天 ${Time.getHourMinute(messageTime)}`;
    }
    return `${Time.getMonthDate(messageTime)} ${Time.getHourMinute(
      messageTime
    )}`;
  }

  return (
    <div className={`w-full ${isSelf ? isSelfClassName : ""}`}>
      <ShowUserOrGroupInfoContext.Consumer>
        {(context) => <Avatar src={`http://${config.ServerPublic}${avatar}`} />}
      </ShowUserOrGroupInfoContext.Consumer>

      <div>
        <div className="flex flex-row-reverse items-end">
          <span className="text-[#333] text-[13px] ml-1">{username}</span>
          <span className="text-[#666] text-[12px]">{formatTime()}</span>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
}
