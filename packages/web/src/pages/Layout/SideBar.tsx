import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";
import Avatar from "../../components/Avatar";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

type FuncButtonProps = {
  index: number;
  name: string;
  iconPath: string;
  route: string;
  className?: string;
  onClick?: (val: number) => void;
};

function FuncButton({
  index,
  name,
  iconPath,
  route,
  className = "",
  onClick = (val) => {},
}: FuncButtonProps) {
  const setIndex = function () {
    onClick(index);
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        className={cn(
          `w-12 h-12 rounded-[50%]
  bg-transparent  
   flex justify-center items-center active:bg-[#ccc] md:hover:bg-[#ccc]  cursor-pointer`,
          className
        )}
        onClick={setIndex}
      >
        <IconButton icon={iconPath} width={48} height={48} iconSize={48} />
      </Button>
      <span className="text-xs mt-1 text-white">{name}</span>
    </div>
  );
}

export default function Sidebar() {
  const wenjianIconPath = require("@/assets/icons/wenjian.svg");
  const duihuaIconPath = require("@/assets/icons/duihua.svg");
  const avatarPath = require("@/assets/avatar/0.jpg");

  const navigate = useNavigate();

  const [subRouteIndex, setSubRouteIndex] = useState(1);

  const selectSubRouteClass = "rounded-[50%]  bg-white/50 ";

  const funcButtonList: FuncButtonProps[] = [
    {
      index: 1,
      name: "首页",
      iconPath: wenjianIconPath,
      route: "/home",
      onClick: setSubRouteIndex,
    },
    {
      index: 2,
      name: "对话",
      iconPath: duihuaIconPath,
      route: "/aigpt",
      onClick: setSubRouteIndex,
    },
  ];

  useEffect(() => {
    const target = funcButtonList.find((elem) => elem.index === subRouteIndex);
    if (target) {
      navigate(target.route);
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
              className={
                subRouteIndex === elem.index ? selectSubRouteClass : ""
              }
              onClick={elem.onClick}
            />
          );
        })}
      </div>
      <div className="">
        <Avatar src={avatarPath} />
      </div>
    </div>
  );
}
