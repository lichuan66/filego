import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface FileRouterType {
  label: string;
  href: string;
}

export type FileType = {
  index: number;
  name: string;
  type: string;
  updateTime: string;
  size: string;
  iconPath: string;
  suolueStatus: number;
};

export interface fileState {
  fileRoute: FileRouterType[];
  fileList: FileType[];
}

const initialState: fileState = {
  fileRoute: [
    {
      label: "根目录",
      href: "/",
    },
  ],
  fileList: [],
};

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFileRoute(state, action) {
      const { fileRoute } = action.payload;
      state.fileRoute = fileRoute;
    },
    setFileList(state, action) {
      const { fileList } = action.payload;
      state.fileList = fileList;
    },
  },
});

export const { setFileRoute, setFileList } = fileSlice.actions;
// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectCount = (state: RootState) => state.file;

export default fileSlice.reducer;
