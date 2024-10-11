import IO from "socket.io-client";
import client from "@filego/config/client";
import store from "./store/store";
import { addLinkmanMessage } from "./store/reducers/userSlice";

const options = {};

const socket = IO(client.Server, options);

socket.on("connect", () => {
  console.log(socket.connected);
});

socket.on("message", (message: any) => {
  console.log("message ===>", message);
  const { dispatch } = store;
  const state = store.getState().user;
  console.log(state);
  const { linkmans } = state;
  // const isSelfMessage = message.from._id === user.user._id
  const linkman = linkmans[message.to];
  if (linkman) {
    dispatch(addLinkmanMessage({ linkmanId: message.to, message }));
  }
});

export default socket;
