import React, { useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import IconButton from "../../components/IconButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/user";
import Message from "../../components/Message";
import useAction from "../../hook/useAction";
import { setToken } from "../../api/auth";

type FuncButtonProps = {
  name: string;
  iconPath: string;
  onClick?: () => void;
};

function FuncButton({ name, iconPath, onClick = () => {} }: FuncButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <Button
        className="w-12 h-12 rounded-[50%]
bg-white border-[#ccc] border 
 flex justify-center items-center active:bg-[#ccc] md:hover:bg-[#ccc]  cursor-pointer"
        onClick={onClick}
      >
        <IconButton icon={iconPath} width={32} height={32} iconSize={32} />
      </Button>
      <span className="text-xs mt-2">{name}</span>
    </div>
  );
}

export default function Base() {
  const phoneIconPath = require("@/assets/icons/phone.svg");
  const userIconPath = require("@/assets/icons/user.svg");
  const plusIconPath = require("@/assets/icons/plus.svg");
  const more = require("@/assets/icons/more.svg");

  const navigate = useNavigate();
  const { setUserInfo } = useAction();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSmallerThan768, setIsSmallerThan768] = useState(false);

  const FuncButtonList: FuncButtonProps[] = [
    {
      name: "手机号登录",
      iconPath: phoneIconPath,
      onClick: () => {},
    },
    {
      name: "其他方式登录",
      iconPath: userIconPath,
      onClick: () => {},
    },
    {
      name: "注册",
      iconPath: plusIconPath,
      onClick: gotoRegister,
    },
    {
      name: "更多",
      iconPath: more,
      onClick: () => {},
    },
  ];

  function gotoRegister() {
    navigate("/register");
  }

  function gotoHome() {
    navigate("/home");
  }

  async function loginHandler() {
    try {
      const res = await login(username, password);
      setUserInfo({
        _id: res._id,
        username: res.username,
        avatar: res.avatar,
      });
      setToken(res.token);
      setUsername("");
      setPassword("");
      Message.success("登录成功");
      gotoHome();
    } catch (error: any) {
      console.error(error.message);
      Message.error(error.message);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSmallerThan768(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`h-full md:bg-rose-500 ${
        isSmallerThan768 ? "" : "flex justify-center items-center"
      } `}
    >
      <div
        className={`relative w-[360px] h-[500px]
        bg-white rounded-lg md:w-[600px] md:h-[500px]
      flex flex-col justify-start px-5 md:px-24 ${
        isSmallerThan768 ? "top-[50px] mx-auto" : ""
      }`}
      >
        <h3 className="text-center mt-[40px] mb-[30px] font-bold text-2xl text-sky-600">
          用户登录
        </h3>
        <Input
          className="h-[54px]  mt-5"
          inputClassName="border-2 border-sky-400"
          placeholder="请输入用户名"
          value={username}
          onChange={setUsername}
        />
        <Input
          className="h-[54px]  mt-5"
          inputClassName="border-2 border-sky-400"
          placeholder="请输入密码"
          value={password}
          onChange={setPassword}
        />
        <Button
          className="mt-10 mx-auto rounded-xl w-48"
          onClick={loginHandler}
        >
          登 录
        </Button>
        <div className="flex flex-1 flex-row items-center justify-between">
          {FuncButtonList.map((elem, id) => {
            return (
              <FuncButton
                key={id}
                name={elem.name}
                iconPath={elem.iconPath}
                onClick={elem.onClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
