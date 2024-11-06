import React, { useContext, useState } from "react";
import { GroupMember } from "../../../types/user";
import { useSelfId } from "../../../hook/useUser";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import config from "@filego/config/client";
import Avatar from "../../../components/Avatar";
import { changeGroupName, deleteGroup } from "../../../api/service";
import Message from "../../../components/Message";
import useAction from "../../../hook/useAction";
import Modal from "../../../components/Modal";
import { ShowUserOrGroupInfoContext } from "../../../context";

interface GroupManagePanelProps {
  visible: boolean;
  onClose: () => void;
  groupId: string;
  avatar: string;
  creator: string;
  onlineMembers: GroupMember[];
}

export default function GroupManagePanel(props: GroupManagePanelProps) {
  const { visible, onClose, groupId, avatar, creator, onlineMembers } = props;

  const showClassName = `translate-x-0`;
  const hideClassName = `translate-x-full`;

  const selfId = useSelfId();
  const [groupName, setGroupName] = useState("");
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const { setLinkmanProperty, removeLinkman } = useAction();
  const context = useContext(ShowUserOrGroupInfoContext);

  function handleClickMask(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  async function handleChangeGroupName() {
    const isSuccess = await changeGroupName(groupId, groupName);
    if (isSuccess) {
      Message.success("修改群名称成功");
      setLinkmanProperty(groupId, "name", groupName);
    }
    setGroupName("");
  }

  async function handleDeleteGroup() {
    const isSuccess = await deleteGroup(groupId);
    if (isSuccess) {
      setDeleteConfirmDialog(false);
      onClose();
      removeLinkman(groupId);
      Message.success("群组解散成功");
    }
  }

  function handleShowUserInfo(userInfo: any) {
    if (userInfo._id === selfId) {
      return;
    }
    // @ts-ignore
    context.showUserInfo({
      _id: userInfo._id,
      avatar: userInfo.avatar,
      username: userInfo.username,
    });
    onClose();
  }

  return (
    <div
      className={`h-full w-[300px] absolute right-0 transition-transform duration-500
    ${visible ? "block" : "hidden"}`}
      onClick={handleClickMask}
      data-float-panel="true"
    >
      <div className="h-full w-[300px] flex flex-col bg-[#fafafaf2] absolute right-0">
        <p
          className="h-[70px] border-b border-solid border-[#e8e8e8] box-border text-center
        leading-[70px] text-[14px] text-[#666] font-bold"
        >
          群组信息
        </p>
        <div className="flex-1 p-[12px] overflow-y-auto">
          {selfId === creator ? (
            <div className="mb-[10px]">
              <p className="leading-[33px] text-[14px] text-[#333] font-bold">
                修改群名称
              </p>
              <Input
                className="h-[36px]"
                value={groupName}
                onChange={setGroupName}
              />
              <Button className=" mt-[8px]" onClick={handleChangeGroupName}>
                确认修改
              </Button>
            </div>
          ) : null}
          {selfId === creator ? (
            <div className="mb-[10px]">
              <p className="leading-[33px] text-[14px] text-[#333] font-bold">
                修改群头像
              </p>
              <img
                src={`http://${config.ServerPublic}${avatar}`}
                alt="群头像"
                onClick={() => {}}
                className="w-[100px] h-[100px] cursor-pointer hover:blur-[3px]"
              />
            </div>
          ) : null}
          <div className="mb-[10px]">
            <p className="leading-[33px] text-[14px] text-[#333] font-bold">
              功能
            </p>
            {selfId === creator ? (
              <Button
                className="mt-[8px]"
                type="danger"
                onClick={() => setDeleteConfirmDialog(true)}
              >
                解散群组
              </Button>
            ) : (
              <Button className="mt-[8px]">退出群组</Button>
            )}
          </div>
          <div className="mb-[10px]">
            <p className="leading-[33px] text-[14px] text-[#333] font-bold">
              在线成员 &nbsp;<span>{onlineMembers.length}</span>&nbsp;
            </p>
            <div className="">
              {onlineMembers.map((member) => (
                <div
                  className="flex items-center justify-between mb-[6px] cursor-default"
                  key={member.user._id}
                >
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleShowUserInfo(member.user)}
                  >
                    <Avatar
                      size={30}
                      src={`http://${config.ServerPublic}${member.user.avatar}`}
                    />
                    <p className="ml-[10px] text-[#333] text-[14px] max-w-[120px] break-keep">
                      {member.user.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Modal
            isOpen={deleteConfirmDialog}
            onClose={() => setDeleteConfirmDialog(false)}
            onOk={handleDeleteGroup}
            showHeader={true}
            title={"删除文件"}
          >
            <div className="w-60 flex flex-row justify-center items-center px-4">
              是否解散该群组?
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
