import React, { useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import IconButton from "../../components/IconButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { login } from "@/api/user";
import { getLinkmansLastMessagesV2, login } from "../../api/service";
import Message from "../../components/Message";
import useAction from "../../hook/useAction";
import { setToken } from "../../api/auth";
import { usePageType } from "../../hook/usePage";
import store from "../../store/store";
import { setLinkmansLastMessages } from "../../store/reducers/userSlice";

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
  const bgUrl = require("../../assets/images/bg.jpg");

  const { dispatch } = store;
  const navigate = useNavigate();
  const { setUserInfo, setFileRoute } = useAction();
  const pageType = usePageType();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSmallerThan768, setIsSmallerThan768] = useState(false);

  const bgStyles =
    pageType === "web"
      ? {
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh", // 设置高度以适应你的需求
        }
      : {};

  const FuncButtonList: FuncButtonProps[] = [
    {
      name: "手机号登录",
      iconPath: "shouji",
      onClick: () => {},
    },
    {
      name: "其他方式登录",
      iconPath: "yonghu",
      onClick: () => {},
    },
    {
      name: "注册",
      iconPath: "a-teshujia",
      onClick: gotoRegister,
    },
    {
      name: "更多",
      iconPath: "gengduo",
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
      const user = await login(username, password);

      if (user) {
        setUserInfo(user);
        setToken(user.token);
        setUsername("");
        setPassword("");
        Message.success("登录成功");
        gotoHome();

        const linkmanIds = [
          ...user.groups.map((group: any) => group._id),
          ...user.friends.map((friend: any) => friend.to._id),
        ];
        const linkmanMessages = await getLinkmansLastMessagesV2(linkmanIds);
        dispatch(setLinkmansLastMessages({ linkmanMessages }));
      }
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
      className={`h-full  ${
        isSmallerThan768 ? "" : "flex justify-center items-center"
      } `}
      style={bgStyles}
    >
      <div
        className={`relative w-[360px] h-[500px]
        bg-white md:bg-opacity-70 md:filter-[10px] md:shadow-md rounded-lg md:w-[600px] md:h-[500px]
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
          onEnter={loginHandler}
        />
        <Input
          className="h-[54px]  mt-5"
          inputClassName="border-2 border-sky-400"
          placeholder="请输入密码"
          value={password}
          onChange={setPassword}
          onEnter={loginHandler}
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
