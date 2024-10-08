import { Socket } from "socket.io";
import logger from "@filego/utils/logger";
import { getSocketIp } from "@filego/utils/getSocketIp";

function defaultCallback(msg: string) {
  logger.error(msg || "Server Error: emit event with callback");
}

export default function registerRoute(socket: Socket, routes: Routes) {
  return async ([event, data, cb = defaultCallback]: MiddlewareArgs) => {
    const route = routes[event];
    if (route) {
      try {
        const ctx: Context<any> = {
          data,
          socket: {
            id: socket.id,
            ip: getSocketIp(socket),
            get user() {
              return socket.data.user;
            },
            set user(newUserId: string) {
              socket.data.user = newUserId;
            },
            get isAdmin() {
              return socket.data.isAdmin;
            },
            join: socket.join.bind(socket),
            leave: socket.leave.bind(socket),
            emit: (target, _event, _data) => {
              socket.to(target).emit(_event, _data);
            },
          },
        };
        const before = Date.now();
        const res = await route(ctx);
        const after = Date.now();
        logger.info(
          `[${event}]`,
          after - before,
          ctx.socket.id,
          ctx.socket.user || "null",
          typeof res === "string" ? res : "null"
        );
        cb(res);
      } catch (error: any) {
        logger.error(`[${event}]`, error.message);
        cb(error.message);
      }
    } else {
      cb(`Server Error: event [${event}] not exists`);
    }
  };
}
