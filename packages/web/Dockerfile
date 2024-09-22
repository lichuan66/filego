# # 使用官方的 Node.js 镜像作为构建阶段的基础镜像
# FROM node:18

# COPY package.json ./package.json

# # 安装依赖
# RUN npm install -g pnpm

# # 构建应用
# RUN npm run build

FROM nginx:alpine

ADD ./packages/web/dist/filego/ /usr/share/nginx/html

EXPOSE 80
