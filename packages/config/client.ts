const server = `${window.location.host.split(":")[0]}:${window.location.port}`;

console.log("NODE_ENV ===>", process.env.NODE_ENV);

export default {
  Server: process.env.NODE_ENV === "development" ? "192.168.1.4:2333" : server,
  ServerPublic:
    process.env.NODE_ENV === "development"
      ? "192.168.1.4:2333"
      : `${server}/public`,
};
