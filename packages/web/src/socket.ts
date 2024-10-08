import IO from "socket.io-client";
import client from "@filego/config/client";

const options = {};

const socket = IO(client.Server, options);

socket.on("connect", () => {
  console.log(socket.connected);
  console.log("socket.id ===>", socket.id);
});

export default socket;
