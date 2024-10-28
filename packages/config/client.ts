import { MB } from "../utils/const";

const server = `${window.location.host.split(":")[0]}:${window.location.port}`;

export default {
  Server: process.env.NODE_ENV === "development" ? "192.168.1.4:2333" : server,
  ServerPublic:
    process.env.NODE_ENV === "development"
      ? "192.168.1.4:2333"
      : `${server}/public`,
  maxImageSize: MB * 5,
  maxBackgroundImageSize: MB * 5,
  maxAvatarSize: MB * 1.5,
  maxFileSize: MB * 10,
};
