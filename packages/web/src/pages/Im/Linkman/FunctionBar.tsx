import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import IconButton from "../../../components/IconButton";
import Modal from "../../../components/Modal";
import Message from "../../../components/Message";
import { createGroup } from "../../../api/service";
import useAction from "../../../hook/useAction";
import Tabs from "../../../components/Tabs";

export default function FunctionBar() {
  const placeholder = "搜索群组/用户";
  // const addIcon = require("../../../assets/icons/add.svg");

  const [groupName, setGroupName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchResultVisible, setSearchResultVisible] = useState(false);
  const { addLinkman } = useAction();

  const tabsSearch = [
    {
      key: "all",
      label: <span className="text-[12px] py-2 px-3">全部</span>,
      children: <div>111</div>,
    },
    {
      key: "user",
      label: <span className="text-[12px] py-2 px-3">用户</span>,
      children: <div>222</div>,
    },
    {
      key: "group",
      label: <span className="text-[12px] py-2 px-3">群组</span>,
      children: <div>333</div>,
    },
  ];

  function resetSearch() {
    setSearchResultVisible(false);
  }

  async function handleCreateGroup() {
    setIsOpen(false);
    setGroupName("");
    const group = await createGroup(groupName);
    if (group) {
      group.type = "group";
      addLinkman(group, true);
      Message.success("群组创建成功");
    }
  }

  function handleFocus() {
    setSearchResultVisible(true);
  }

  function handleBodyClick(e: any) {
    const { currentTarget } = e;
    let { target } = e;
    do {
      if (
        target.getAttribute("data-float-panel") === "searchResult" ||
        target.getAttribute("data-float-panel") === "searchInput"
      ) {
        return;
      }
      target = target.parentElement;
    } while (target && target !== currentTarget);
    resetSearch();
  }

  useEffect(() => {
    document.body.addEventListener("click", handleBodyClick, false);
    return () => {
      document.body.removeEventListener("click", handleBodyClick, false);
    };
  });

  return (
    <div className="w-full flex flex-row gap-2 justify-center p-2 py-4">
      <form
        data-float-panel="searchInput"
        onSubmit={(e) => e.preventDefault()}
        className="flex justify-center items-center w-[100%]"
      >
        <Input
          placeholder={placeholder}
          onChange={() => {}}
          onFocus={handleFocus}
        />
      </form>
      <IconButton
        icon={"a-teshujia"}
        width={32}
        height={32}
        iconSize={22}
        iconColor="white"
        className="cursor-pointer  opacity-40 hover:opacity-100 border rounded-lg text-black bg-blue-400"
        onClick={() => setIsOpen(true)}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onOk={handleCreateGroup}
        showHeader={true}
        title={"创建群组"}
      >
        <form action="" className="w-full">
          <h3>请输入群组名</h3>
          <Input value={groupName} onChange={setGroupName} />
        </form>
      </Modal>
      <Tabs
        data-float-panel="searchResult"
        tabPosition="top"
        items={tabsSearch}
        defaultActiveKey="default"
        tabBarStyle={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: "40px",
        }}
        style={{ display: searchResultVisible ? "block" : "none" }}
        className="absolute top-[70px] left-[105px] w-[220px] bg-[#ffffffe6] shadow
        rounded-tl-[6px] rounded-tr-[6px]"
      ></Tabs>
    </div>
  );
}
