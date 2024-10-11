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
  maxContent: string;
}

export default function Message(props: PropsType) {
  const {
    isSelf,
    avatar,
    username,
    time,
    content,
    maxContent = "200px",
  } = props;

  //   const newAvatar = require(avatar);

  const isSelfBoxClass = `
  flex-row-reverse
  `;
  const isSelfNameClass = `
   flex-row-reverse
  `;
  const isSelfContentBoxClass = `
  flex-row-reverse
  `;
  const isSelfContentClass = `
  rounded-tl-lg rounded-tr-none
  `;
  const isSelfArrowClass = `
    right-[65px] border-l-green-400   border-r-0  border-l-[7px]
  `;

  function formatTime() {
    const messageTime = new Date(time);
    const nowTime = new Date();

    console.log();

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
    <div
      className={`w-full mb-[10px] relative flex  ${
        isSelf ? isSelfBoxClass : "flex-row"
      }`}
    >
      <ShowUserOrGroupInfoContext.Consumer>
        {(context) => <Avatar src={`http://${config.ServerPublic}${avatar}`} />}
      </ShowUserOrGroupInfoContext.Consumer>

      <div className={`flex flex-col  ${isSelf ? "mr-[12px]" : "ml-[12px]"}`}>
        <div className={`flex gap-1 ${isSelf ? isSelfNameClass : "flex-row"}`}>
          <span className="text-[#333] text-[13px] ">{username}</span>
          <span className="text-[#666] text-[12px]">{formatTime()}</span>
        </div>
        <div className={`flex  ${isSelf ? isSelfContentBoxClass : "flex-row"}`}>
          <div
            style={{ maxWidth: maxContent }}
            className={` break-words px-[8px] py-[6px]
               bg-green-400 rounded-lg 
               ${isSelf ? isSelfContentClass : "rounded-tl-none"}`}
          >
            {content}
          </div>
        </div>
        <div
          className={`absolute top-[20px]  border-transparent
            border-t-0  border-b-[15px]  border-solid
           ${
             isSelf
               ? isSelfArrowClass
               : "left-[65px] border-r-green-400 border-l-0 border-r-[7px]"
           }
           `}
        ></div>
      </div>
    </div>
  );
}
