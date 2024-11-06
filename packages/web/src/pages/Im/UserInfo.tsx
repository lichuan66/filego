import React, { useEffect } from "react";
import Modal from "../../components/Modal";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import config from "@filego/config/client";
import { useSelfId, useLinkmans } from "../../hook/useUser";
import { addFriend, deleteFriend } from "../../api/service";
import useAction from "../../hook/useAction";
import { Linkman } from "../../types/user";
import getFriendId from "@filego/utils/getFriendId";
import Message from "../../components/Message";

type PropType = {
  visible: boolean;
  user?: {
    _id: string;
    username: string;
    avatar: string;
  };
  onClose: () => void;
};

export default function UserInfo(props: PropType) {
  const { visible, user, onClose } = props;

  const selfId = useSelfId();
  const linkmans = useLinkmans();
  const { addLinkman, setFocus, removeLinkman } = useAction();

  // 获取好友id
  if (user && user._id.length === selfId.length) {
    user._id = getFriendId(selfId, user._id);
  }

  // @ts-ignore
  const linkman = linkmans[user?._id];
  const isFriend = linkman && linkman.type === "friend";
  const originUserId = user && user._id.replace(selfId, "");

  useEffect(() => {
    if (user && user._id) {
    }
  }, [selfId, user]);

  /** 发送消息 */
  function handleFocusUser() {
    onClose();
    // @ts-ignore
    setFocus(user?._id);
  }

  /** 添加用户 */
  async function handleAddFriend() {
    // @ts-ignore
    const friend = await addFriend(originUserId);
    if (friend) {
      onClose();
      // @ts-ignore
      const { _id } = user;
      const newLinkman = {
        _id,
        from: selfId,
        to: {
          _id: originUserId,
          username: friend.username,
          avatar: friend.avatar,
        },
        type: "friend",
        createTime: Date.now(),
      };
      addLinkman(newLinkman as unknown as Linkman, true);
      handleFocusUser();
    }
  }

  /**
   * 删除朋友
   */
  async function handleDeleteFriend() {
    // @ts-ignore
    const isSuccess = await deleteFriend(originUserId);
    if (isSuccess) {
      onClose();
      // @ts-ignore
      removeLinkman(user?._id);
      Message.success("删除好友成功");
    }
  }

  return (
    <Modal
      isOpen={visible}
      onClose={onClose}
      onOk={() => {}}
      showHeader={false}
      showBottom={false}
      title={"创建群组"}
    >
      {visible && user ? (
        <div>
          <div className="flex flex-col items-center">
            <Avatar
              src={`http://${config.ServerPublic}${user.avatar}`}
              size={80}
            />
            <p>{user.username}</p>
          </div>
          <div>
            {isFriend ? (
              <Button onClick={handleFocusUser} className="w-full mt-[10px]">
                发送消息
              </Button>
            ) : null}
            {isFriend ? (
              <Button
                onClick={handleDeleteFriend}
                type="danger"
                className="w-full mt-[10px]"
              >
                删除好友
              </Button>
            ) : (
              <Button onClick={handleAddFriend} className="w-full mt-[10px]">
                加为好友
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
