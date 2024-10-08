import Message from "../components/Message";
import socket from "../socket";

export default function fetch<T = any>(
  event: string,
  data: {}
): Promise<[string | null, T | null]> {
  return new Promise((resolve) => {
    socket.emit(event, data, (res: any) => {
      if (typeof res === "string") {
        Message.error(res);
        resolve([res, null]);
      } else {
        resolve([null, res]);
      }
    });
  });
}
