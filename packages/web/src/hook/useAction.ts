import { useDispatch } from "react-redux";

import {
  setPageType,
  setWidthAndHeight,
  setSiderBarOpen,
} from "../store/reducers/pageSlice";
import { setUserInfo } from "../store/reducers/userSlcie";
import { UserState } from "../store/reducers/userSlcie";
import { setFileRoute, setFileList } from "../store/reducers/fileSlice";
import type { FileRouterType, FileType } from "../store/reducers/fileSlice";

export default function useAction() {
  const dispatch = useDispatch();

  return {
    setPageType(pageType: string) {
      dispatch(setPageType({ pageType }));
    },
    setWidthAndHeight(width: number, height: number) {
      dispatch(setWidthAndHeight({ width, height }));
    },
    setSiderBarOpen(status: boolean) {
      dispatch(setSiderBarOpen({ status }));
    },
    setUserInfo(user: UserState) {
      dispatch(setUserInfo({ user }));
    },
    setFileRoute(fileRoute: FileRouterType[]) {
      dispatch(setFileRoute({ fileRoute }));
    },
    setFileList(fileList: FileType[]) {
      dispatch(setFileList({ fileList }));
    },
  };
}
