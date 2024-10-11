import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { State, Linkman, LinkmansMap } from "../../types/user";

export interface UserState extends State {}

// const initialState: UserState = {
//   _id: "",
//   username: "",
//   avatar: "",
// };

const initialState: State = {
  user: null,
  linkmans: {},
  focus: "",
  connect: false,
  status: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : initialState,
  // initialState,
  reducers: {
    setUserInfo(state, action) {
      const { user } = action.payload;

      const { _id, username, avatar, tag, groups, friends, isAdmin } = user;
      const linkmans = [
        ...groups.map(transformGroup),
        ...friends.map(transformFriend),
      ];

      state.user = {
        _id,
        username,
        avatar,
        tag,
        isAdmin,
      };
      state.linkmans = getLinkmansMap(linkmans);
      localStorage.setItem("user", JSON.stringify(state));

      // Object.keys(user).forEach((key) => {
      //   //@ts-ignore
      //   state[key] = user[key];
      // });
    },
    setFocus(state, action) {
      const { focusId } = action.payload;
      state.focus = focusId;
    },
    setLinkmanProperty(state, action) {
      const { linkmanId, key, value } = action.payload;
      state.linkmans[linkmanId] = {
        ...state.linkmans[linkmanId],
        [key]: value,
      };
    },
    addLinkmanMessage(state, action) {
      const { linkmanId, message } = action.payload;
      const targetLinkman = state.linkmans[linkmanId];
      if (targetLinkman) {
        if (state.focus !== linkmanId) {
          targetLinkman.unread++;
        }
        state.linkmans = {
          ...state.linkmans,
          [linkmanId]: {
            ...targetLinkman,
            messages: {
              ...targetLinkman.messages,
              [message._id]: message,
            },
            unread: targetLinkman.unread,
          },
        };
      }
    },
    deleteMessage(state, action) {
      const { linkmanId, messageId } = action.payload;
      const targetLinkman = state.linkmans[linkmanId];
      if (!targetLinkman) {
        console.warn(`联系人 ${linkmanId} 不存在`);
        return;
      }
      const messages = targetLinkman.messages;
      delete messages[messageId];
    },
    updateMessage(state, action) {
      const { linkmanId, messageId, value } = action.payload;
      const targetLinkman = state.linkmans[linkmanId];
      if (targetLinkman) {
        let messages = {};
        if (value._id) {
          delete targetLinkman.messages[messageId];

          messages = {
            ...targetLinkman.messages,
            [value._id]: value,
          };
        } else {
          messages = {
            ...targetLinkman.messages,
            [messageId]: {
              ...targetLinkman.message[messageId],
              ...value,
            },
          };
        }
        targetLinkman.messages = messages;
      }
    },
  },
});

export const {
  setUserInfo,
  setFocus,
  setLinkmanProperty,
  addLinkmanMessage,
  deleteMessage,
  updateMessage,
} = userSlice.actions;
// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectCount = (state: RootState) => state.user;

export default userSlice.reducer;

/**
 * 将联系人以_id为键转为对象结构
 * @param linkmans 联系人数组
 */
function getLinkmansMap(linkmans: Linkman[]) {
  return linkmans.reduce((map: LinkmansMap, linkman) => {
    map[linkman._id] = linkman;
    return map;
  }, {});
}

/**
 * 初始化联系人部分公共字段
 * @param linkman 联系人
 * @param type 联系人类型
 */
function initLinkmanFields(linkman: Linkman, type: string) {
  linkman.type = type;
  linkman.unread = 0;
  linkman.messages = {};
}

/**
 * 转换群组数据结构
 * @param group 群组
 */
function transformGroup(group: Linkman): Linkman {
  initLinkmanFields(group, "group");
  group.creator = group.creator || "";
  group.onlineMembers = [];
  return group;
}

function getFriendId(userId1: string, userId2: string) {
  if (userId1 < userId2) {
    return userId1 + userId2;
  }
  return userId2 + userId1;
}

/**
 * 转换好友的数据结构
 */
function transformFriend(friend: Linkman): Linkman {
  // @ts-ignore
  const { from, to } = friend;
  const transformedFriend = {
    _id: getFriendId(from, to._id),
    name: to.name,
    avatar: to.avatar,
    // @ts-ignore
    createTime: friend.createTime,
  };
  initLinkmanFields(transformedFriend as Linkman, "friend");
  return transformedFriend as Linkman;
}
