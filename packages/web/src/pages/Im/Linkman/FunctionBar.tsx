import React, { useState } from "react";
import Input from "../../../components/Input";
import IconButton from "../../../components/IconButton";
import Modal from "../../../components/Modal";
import Message from "../../../components/Message";
import { createGroup } from "../../../api/service";
import useAction from "../../../hook/useAction";

export default function FunctionBar() {
  const placeholder = "搜索群组/用户";
  const addIcon = require("../../../assets/icons/add.svg");

  const [groupName, setGroupName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { addLinkman } = useAction();

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

  return (
    <div className="w-full flex flex-row gap-2 justify-center p-2 py-4">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex justify-center items-center w-[100%]"
      >
        <Input placeholder={placeholder} onChange={() => {}} />
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
    </div>
  );
}
