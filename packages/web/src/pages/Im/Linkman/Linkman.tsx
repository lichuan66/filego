import React from "react";
import Avatar from "../../../components/Avatar";
import Time from "../../../../../utils/time";
import useAction from "../../../hook/useAction";
import { useFocus } from "../../../hook/useUser";
import config from "@filego/config/client";

interface LinkmanProp {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  unread: number;
  time: Date;
}

export default function Linkman(props: LinkmanProp) {
  const { id, name, avatar, preview, unread, time } = props;

  const { setFocus } = useAction();
  const ficusId = useFocus();

  function formatTime() {
    const nowTime = new Date();
    if (Time.isToday(nowTime, time)) {
      return Time.getHourMinute(time);
    }
    if (Time.isYesterday(nowTime, time)) {
      return "昨天";
    }
    return Time.getMonthDate(time);
  }

  function handleClick() {
    setFocus(id);
  }

  return (
    <div
      className={`w-full flex flex-row p-2 gap-2 cursor-pointer hover:bg-blue-200
        ${ficusId === id ? "bg-blue-200" : ""}
        `}
      onClick={handleClick}
    >
      <Avatar src={`http://${config.ServerPublic}${avatar}`} size={50} />
      <div className="flex flex-auto flex-col justify-between">
        <div className="flex flex-row justify-between text-xs text-gray-500">
          <p>{name}</p>
          <p>{formatTime()}</p>
        </div>
        <div className=" text-[16px] text-gray-500 flex flex-row justify-between">
          <p className="w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
            {preview}
          </p>
          {unread > 0 && (
            <div className="w-[18px] h-[18px] rounded-full bg-red-500 text-center">
              <span className="text-[#e9e9e9] text-[10px] leading-[10px] top-[-4px] relative">
                {unread > 99 ? "99+" : unread}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
