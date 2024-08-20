import { configureStore } from "@reduxjs/toolkit";
import slice from "./reducer";

const store = configureStore({
  reducer: {
    page: slice.pageSlice,
    user: slice.userSlcie,
  },
});

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export const state = store.getState();
export type RootState = ReturnType<typeof store.getState>;
// 推断出类型:
export type AppDispatch = typeof store.dispatch;

export default store;
