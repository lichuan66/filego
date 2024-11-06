import IO from "socket.io-client";
import client from "@filego/config/client";
import store from "./store/store";
import {
  addLinkmanMessage,
  setUserInfo,
  setLinkmansLastMessages,
  setLinkmanProperty,
  removeLinkman,
} from "./store/reducers/userSlice";
import { getLinkmansLastMessagesV2, loginByToken } from "./api/service";
import getFriendId from "@filego/utils/getFriendId";

const options = {};

const socket = IO(client.Server, options);
const { dispatch } = store;

socket.on("connect", async () => {
  console.log(socket.connected);

  const token = window.localStorage.getItem("token");
  if (token) {
    const user = await loginByToken(token);
    if (user) {
      dispatch(setUserInfo({ user }));
      const linkmanIds = [
        ...user.groups.map((group: any) => group._id),
        ...user.friends.map((friend: any) =>
          getFriendId(friend.from, friend.to)
        ),
      ];
      const linkmanMessages = await getLinkmansLastMessagesV2(linkmanIds);

      dispatch(setLinkmansLastMessages({ linkmanMessages }));
    } else {
    }
  }
});

socket.on("message", (message: any) => {
  const state = store.getState().user;
  const { linkmans } = state;
  // const isSelfMessage = message.from._id === user.user._id
  const linkman = linkmans[message.to];
  if (linkman) {
    dispatch(addLinkmanMessage({ linkmanId: message.to, message }));
  }
});

socket.on(
  "changeGroupName",
  ({ groupId, name }: { groupId: string; name: string }) => {
    dispatch(
      setLinkmanProperty({ linkmanId: groupId, key: "name", value: name })
    );
  }
);

socket.on("deleteGroup", ({ groupId }: { groupId: string }) => {
  dispatch(removeLinkman({ linkmanId: groupId }));
});

export default socket;
