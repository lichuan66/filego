export interface Message {
  _id: string;
  type: string;
  content: string;
  from: {
    _id: string;
    username: string;
    avatar: string;
    originUsername: string;
    tag: string;
  };
  loading: boolean;
  percent: number;
  createTime: string;
  deleted?: boolean;
}

export interface MessageMap {
  [messageId: string]: Message;
}

export interface GroupMember {
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  os: string;
  browser: string;
  environment: string;
}

export interface User {
  _id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

export interface Group {
  _id: string;
  name: string;
  avatar: string;
  createTime: string;
  creator: string;
  onlineMembers: GroupMember[];
}

export interface Linkman extends Group, User {
  type: string;
  unread: number;
  messages: MessageMap;
}

export interface LinkmansMap {
  [linkmanId: string]: Linkman;
}

export interface State {
  /** 用户信息 */
  user: {
    _id: string;
    username: string;
    avatar: string;
    tag: string;
    isAdmin: string;
  } | null;
  /** 联系人 */
  linkmans: LinkmansMap;
  /** 聚焦的联系人 */
  focus: string;
  /** 客户端连接状态 */
  connect: boolean;
  /** 客户端的一些状态值 */
  status: {};
}
