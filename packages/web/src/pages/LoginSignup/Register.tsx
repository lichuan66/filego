import React from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import IconButton from "../../components/IconButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Base() {
  const backIconPath = require("@/assets/icons/back.svg");
  const more = require("@/assets/icons/more.svg");

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function gotoLogin() {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-rose-500 flex justify-center items-center">
      <div
        className="w-[360px] h-[500px]
       bg-white rounded-lg md:w-[600px] md:h-[500px]
       flex flex-col justify-start px-5 md:px-24"
      >
        <h3 className="text-center mt-[40px] mb-[30px] font-bold text-2xl text-sky-600">
          注册
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
        <Button className="mt-10 mx-auto rounded-xl w-48">注 册</Button>
        <div className="flex flex-1 flex-row items-center justify-between">
          <div className="flex flex-col items-center">
            <Button
              className="w-12 h-12 rounded-[50%]
           bg-white border-[#ccc] border 
            flex justify-center items-center hover:bg-[#ccc] cursor-pointer"
              onClick={gotoLogin}
            >
              <IconButton
                icon={backIconPath}
                width={32}
                height={32}
                iconSize={32}
              />
            </Button>
            <span className="text-xs mt-2">已有账号, 去登录</span>
          </div>

          <div className="flex flex-col items-center">
            <Button
              className="w-12 h-12 rounded-[50%]
           bg-white border-[#ccc] border flex 
           justify-center items-center hover:bg-[#ccc] cursor-pointer"
            >
              <IconButton icon={more} width={32} height={32} iconSize={32} />
            </Button>
            <span className="text-xs mt-2">更多</span>
          </div>
        </div>
      </div>
    </div>
  );
}
