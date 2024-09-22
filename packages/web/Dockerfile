# 使用官方的 Node.js 镜像作为构建阶段的基础镜像
FROM node:18

COPY package.json ./package.json

# 安装依赖
RUN npm install -g pnpm

# 构建应用
RUN pnpm run build

FROM nginx:alpine

ADD ./dist/filego/ /usr/share/nginx/html/nrp-web/

EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]