import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface UserState {
  _id: string;
  username: string;
  avatar: string;
}

const initialState: UserState = {
  _id: "",
  username: "",
  avatar: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : initialState,
  reducers: {
    setUserInfo(state, action) {
      const { user } = action.payload;
      localStorage.setItem("user", JSON.stringify(user));
      Object.keys(user).forEach((key) => {
        //@ts-ignore
        state[key] = user[key];
      });
    },
  },
});

export const { setUserInfo } = userSlice.actions;
// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectCount = (state: RootState) => state.user;

export default userSlice.reducer;
