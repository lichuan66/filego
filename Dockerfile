FROM node:18

WORKDIR /usr/app/filego

COPY packages ./packages
COPY package.json tsconfig.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN touch .env

# 安装 pnpm
RUN npm install -g pnpm

RUN npm install pm2 -g
RUN npm install -g bun

RUN pnpm install

# RUN npm run build

# CMD npm run dev:server

CMD ["pm2", "start", "/usr/app/filego/packages/server/src/main.ts", "--no-daemon"]