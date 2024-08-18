import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface PageState {
  winWidth: number;
  winHeight: number;
  pageType: string;
  siderBarOpen: boolean;
}

const initialState: PageState = {
  winWidth: 0,
  winHeight: 0,
  pageType: "web",
  siderBarOpen: false,
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setWidthAndHeight(state, action) {
      const { width, height } = action.payload;
      state.winWidth = width;
      state.winHeight = height;
    },
    setPageType(state, action) {
      const { pageType } = action.payload;
      state.pageType = pageType;
    },
    setSiderBarOpen(state, action) {
      const { status } = action.payload;
      state.siderBarOpen = status;
    },
  },
});

export const { setWidthAndHeight, setPageType, setSiderBarOpen } =
  pageSlice.actions;
// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectCount = (state: RootState) => state.page;

export default pageSlice.reducer;
