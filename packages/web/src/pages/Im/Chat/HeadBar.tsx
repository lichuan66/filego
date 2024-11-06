import React from "react";
import IconButton from "../../../components/IconButton";
import CopyToClipboard from "react-copy-to-clipboard";
import Message from "../../../components/Message";

type PropsType = {
  name: string;
  id: string;
  type: string;
  onlineMembersCount?: number;
  isOnline?: boolean;
  onClickFunction: () => void;
};

export default function HeaderBar(props: PropsType) {
  const { id, name, type, onlineMembersCount, isOnline, onClickFunction } =
    props;

  function handleShareGroup() {
    Message.success("已复制邀请链接到粘贴板, 去邀请其它人加入群组吧");
  }

  return (
    <div className="w-full h-[70px] px-4 py-1 flex flex-row justify-between items-center">
      <h2>
        {name && (
          <span>
            {name}
            {"  "}
            {onlineMembersCount !== undefined && (
              <b>{`(${onlineMembersCount})`}</b>
            )}
            {isOnline !== undefined && (
              <b>{`(${isOnline ? "在线" : "离线"})`}</b>
            )}
          </span>
        )}
      </h2>
      {
        <div className="flex flex-row justify-between items-center gap-3">
          {type === "group" && (
            <CopyToClipboard
              text={`${window.location.origin}/invite/group/${id}`}
            >
              <IconButton
                icon={"JC_054"}
                width={28}
                height={28}
                iconSize={28}
                iconColor="#60a5fa"
                className="cursor-pointer  opacity-100 hover:opacity-40"
                onClick={handleShareGroup}
              />
            </CopyToClipboard>
          )}
          <IconButton
            icon={"zuocedaohangcaidan-caidanhuizong"}
            width={28}
            height={28}
            iconSize={28}
            iconColor="#60a5fa"
            className="cursor-pointer  opacity-100 hover:opacity-40"
            onClick={onClickFunction}
          />
        </div>
      }
    </div>
  );
}
