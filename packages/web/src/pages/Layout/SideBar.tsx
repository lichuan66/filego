import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";
import Avatar from "../../components/Avatar";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown";
import { useAvatar } from "../../hook/useUser";
import config from "@filego/config/client";
import { setToken } from "../../api/auth";

type FuncButtonProps = {
  index: number;
  name: string;
  iconPath: string;
  route: string;
  className?: string;
  buttonClassName?: string;
  spanClassName?: string;
  iconColor?: string;
  onClick?: (val: number) => void;
};

function FuncButton({
  index,
  name,
  iconPath,
  route,
  spanClassName = "",
  buttonClassName = "",
  className = "",
  iconColor = "white",
  onClick = (val) => {},
}: FuncButtonProps) {
  const setIndex = function () {
    onClick(index);
  };

  return (
    <div className={cn("group flex flex-col items-center", className)}>
      <Button
        className={cn(
          `w-12 h-12 rounded-[50%]
  bg-transparent  
   flex justify-center items-center active:bg-[#ccc] md:hover:bg-[#ccc]  cursor-pointer`,
          buttonClassName
        )}
        onClick={setIndex}
      >
        <IconButton
          icon={iconPath}
          width={28}
          height={28}
          iconSize={24}
          iconColor={iconColor}
        />
      </Button>
      <span className={cn("text-xs mt-1 text-skyblue-400", spanClassName)}>
        {name}
      </span>
    </div>
  );
}

function AvatarSetting({
  avatarPath,
  avatarSettingButtonList,
}: {
  avatarPath: string;
  avatarSettingButtonList: FuncButtonProps[];
}) {
  return (
    <div className=" ml-[30px] h-[200px] w-[300px] bg-gradient-to-br from-white via-white via-white via-purple-200 to-purple-300 border  rounded-lg flex flex-col">
      <div className="px-5 w-full h-[80px] flex flex-row items-center">
        <div>
          <Avatar
            className="cursor-pointer"
            size={40}
            src={`http://${config.ServerPublic}${avatarPath}`}
            onClick={() => {}}
          />
        </div>
        <div className="ml-4">
          <span>Uid: 123456</span>
        </div>
      </div>
      <div className="rounded-lg flex-1 w-full  flex flex-row flex-wrap justify-center items-center gap-5">
        {avatarSettingButtonList.map((elem) => {
          return (
            <FuncButton
              key={elem.index}
              index={elem.index}
              name={elem.name}
              iconPath={elem.iconPath}
              route={elem.route}
              onClick={elem.onClick}
              iconColor={elem.iconColor}
              className="group md:hover:bg-inherit text-black "
              buttonClassName="md:hover:bg-transparent"
              spanClassName="group-hover:text-sky-600"
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();

  const [subRouteIndex, setSubRouteIndex] = useState(2);

  const avatar = useAvatar();

  const selectSubRouteClass = "rounded-[50%]  bg-white/50 ";

  const funcButtonList: FuncButtonProps[] = [
    {
      index: 1,
      name: "首页",
      iconPath: "wenjianjia3",
      route: "/home",
      onClick: setSubRouteIndex,
    },
    {
      index: 2,
      name: "消息",
      iconPath: "duorenyonghu",
      route: "/im",
      onClick: setSubRouteIndex,
    },
    {
      index: 3,
      name: "对话",
      iconPath: "jiqiren",
      route: "/aigpt",
      onClick: setSubRouteIndex,
    },
  ];

  const avatarSettingButtonList = [
    {
      index: 4,
      name: "我要反馈",
      iconPath: "woyaofankui",
      route: "/home",
      iconColor: "black",
      onClick: setSubRouteIndex,
    },
    {
      index: 5,
      name: "联系我们",
      iconPath: "youjian",
      route: "/aigpt",
      iconColor: "black",
      onClick: setSubRouteIndex,
    },
    {
      index: 6,
      name: "关于filego",
      iconPath: "changjianwentixiangguanwenti",
      route: "https://github.com/lichuan66/filego",
      iconColor: "black",
      onClick: setSubRouteIndex,
    },
    {
      index: 7,
      name: "退出登录",
      iconPath: "tuichu1",
      route: "/login",
      iconColor: "red",
      onClick: setSubRouteIndex,
    },
  ];

  useEffect(() => {
    const allButtonList = [...funcButtonList, ...avatarSettingButtonList];
    const target = allButtonList.find((elem) => elem.index === subRouteIndex);
    if (target && !target.route.includes("https://")) {
      navigate(target.route);
      if (target.route === "/login") {
        setToken("");
      }
    } else if (target && target.route.includes("https://")) {
      window.location.href = target.route;
    }
  }, [subRouteIndex]);

  return (
    <div className="h-full flex flex-col items-center justify-between py-5 bg-gradient-to-b from-purple-500 to-pink-500">
      <div className="flex flex-col gap-8">
        {funcButtonList.map((elem) => {
          return (
            <FuncButton
              key={elem.index}
              index={elem.index}
              name={elem.name}
              iconPath={elem.iconPath}
              route={elem.route}
              className="text-white"
              buttonClassName={
                subRouteIndex === elem.index ? selectSubRouteClass : ""
              }
              onClick={elem.onClick}
            />
          );
        })}
      </div>
      <div className="">
        <Dropdown
          trigger={["click"]}
          overlay={
            <AvatarSetting
              avatarPath={avatar}
              avatarSettingButtonList={avatarSettingButtonList}
            />
          }
          animation="slide-up"
          placement="bottomRight"
        >
          <Avatar
            className="cursor-pointer"
            src={`http://${config.ServerPublic}${avatar}`}
            onClick={() => {}}
          />
        </Dropdown>
      </div>
    </div>
  );
}
