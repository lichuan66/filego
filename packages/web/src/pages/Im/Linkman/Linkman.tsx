import React from "react";
import Avatar from "../../../components/Avatar";
import Time from "../../../../../utils/time";
import useAction from "../../../hook/useAction";

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

  const newAvatar = require("../../../assets/avatar/0.jpg");
  console.log(avatar);

  // const newAvatar = require(avatar);

  const { setFocus } = useAction();

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
      className="w-full flex flex-row p-2 gap-2 cursor-pointer hover:bg-blue-200"
      onClick={handleClick}
    >
      <Avatar src={newAvatar} size={50} />
      <div className="flex flex-auto flex-col justify-between">
        <div className="flex flex-row justify-between text-xs text-gray-500">
          <p>{name}</p>
          <p>{formatTime()}</p>
        </div>
        <div className=" text-[16px] text-gray-500">
          <p>{preview}</p>
          {unread > 0 && (
            <div>
              <span>{unread > 99 ? "99+" : unread}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
