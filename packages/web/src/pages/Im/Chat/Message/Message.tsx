import React, { useState } from "react";
import { ShowUserOrGroupInfoContext } from "../../../../context";
import Avatar from "../../../../components/Avatar";
import Time from "../../../../../../utils/time";
import config from "@filego/config/client";
import TextMessage from "./TextMessage";
import ImageMessage from "./ImageMessage";
import FileMessage from "./FileMessage";

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
  type: string;
  percent: number;
}

export default function Message(props: PropsType) {
  const {
    isSelf,
    avatar,
    username,
    time,
    content,
    maxContent = "200px",
    userId,
    type,
    percent,
  } = props;

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
    right-[55px] border-l-green-400   border-r-0  border-l-[7px]
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

  function handleClickAvatar(showUserInfo: (userInfo: any) => void) {
    if (!isSelf) {
      showUserInfo({
        _id: userId,
        username,
        avatar,
      });
    }
  }

  function renderContent() {
    switch (type) {
      case "text":
        return <TextMessage content={content} />;
      case "image":
        return <ImageMessage src={content} />;
      case "file":
        return <FileMessage file={content} percent={percent} />;
      default:
        return <div>不支持的消息类型</div>;
    }
  }

  return (
    <div
      className={`w-full mb-[15px] relative flex  ${
        isSelf ? isSelfBoxClass : "flex-row"
      }`}
    >
      <ShowUserOrGroupInfoContext.Consumer>
        {(context) => (
          <Avatar
            src={`http://${config.ServerPublic}${avatar}`}
            onClick={() =>
              // @ts-ignore
              handleClickAvatar(context.showUserInfo)
            }
            size={46}
          />
        )}
      </ShowUserOrGroupInfoContext.Consumer>

      <div className={`flex flex-col  ${isSelf ? "mr-[12px]" : "ml-[12px]"}`}>
        <div className={`flex gap-1 ${isSelf ? isSelfNameClass : "flex-row"}`}>
          <span className="text-[#333] text-[13px] ">{username}</span>
          <span className="text-[#666] text-[12px]">{formatTime()}</span>
        </div>
        <div className={`flex  ${isSelf ? isSelfContentBoxClass : "flex-row"}`}>
          {(type === "text" || type === "file") && (
            <div
              style={{ maxWidth: maxContent }}
              className={` break-words px-[8px] py-[6px]
               ${
                 type === "text" || type === "file"
                   ? "bg-green-400 rounded-lg"
                   : ""
               }  
               ${isSelf ? isSelfContentClass : "rounded-tl-none"}`}
            >
              {renderContent()}
            </div>
          )}
          {type === "image" && <div>{renderContent()}</div>}
        </div>
        {(type === "text" || type === "file") && (
          <div
            className={`absolute top-[20px]  border-transparent
            border-t-0  border-b-[15px]  border-solid
           ${
             isSelf
               ? isSelfArrowClass
               : "left-[55px] border-r-green-400 border-l-0 border-r-[7px]"
           }
           `}
          ></div>
        )}
      </div>
    </div>
  );
}
