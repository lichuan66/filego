import ip from "ip";

const { env } = process;

export default {
  /** 服务端host，默认为本机ip地址（可能会是局域网地址） */
  host: env.Host || ip.address(),

  port: env.Port ? parseInt(env.Port, 10) : 2333,

  database: env.Database || "mongodb://127.0.0.1:27017/filego",

  jwtSecret: "7acsd9gh@",

  SALT_ROUNDS: 10,

  PublicPath: "",
};
