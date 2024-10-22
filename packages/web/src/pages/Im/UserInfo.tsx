import React, { useEffect } from "react";
import Modal from "../../components/Modal";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import config from "@filego/config/client";
import { useSelfId, useLinkmans } from "../../hook/useUser";
import { addFriend } from "../../api/service";
import useAction from "../../hook/useAction";
import { Linkman } from "../../types/user";

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
  const { addLinkman, setFocus } = useAction();

  // @ts-ignore
  const linkman = linkmans[user?._id];
  const isFriend = linkman && linkman.type === "friend";
  const originUserId = user && user._id.replace(selfId, "");

  useEffect(() => {
    if (user && user._id) {
    }
  }, [selfId, user]);

  async function handleAddFriend() {
    console.log(12345);

    // @ts-ignore
    const friend = await addFriend(user?._id);
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
      console.log("newLinkman ===>", newLinkman);

      addLinkman(newLinkman as unknown as Linkman, true);
      // @ts-ignore
      setFocus(user?._id);
      console.log(user?._id, 1234);
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
            {isFriend ? <Button>发送消息</Button> : null}
            {isFriend ? (
              <Button type="danger">删除好友</Button>
            ) : (
              <Button onClick={handleAddFriend}>加为好友</Button>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
