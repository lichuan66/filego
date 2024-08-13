FROM node:18

WORKDIR /usr/app/filego

COPY packages ./packages
COPY package.json tsconfig.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN touch .env

# 安装 pnpm
RUN npm install -g pnpm

RUN pnpm install

RUN npm run build

CMD npm run dev:server
