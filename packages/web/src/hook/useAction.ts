import { useDispatch } from "react-redux";

import {
  setPageType,
  setWidthAndHeight,
  setSiderBarOpen,
} from "../store/reducers/pageSlice";
import {
  setUserInfo,
  setFocus,
  setLinkmanProperty,
  addLinkmanMessage,
  deleteMessage,
  updateMessage,
  addLinkman,
} from "../store/reducers/userSlice";
import { setFileRoute, setFileList } from "../store/reducers/fileSlice";
import type { FileRouterType, FileType } from "../store/reducers/fileSlice";
import type { Linkman, Message } from "../types/user";

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
    setUserInfo(user: any) {
      dispatch(setUserInfo({ user }));
    },
    setFileRoute(fileRoute: FileRouterType[]) {
      dispatch(setFileRoute({ fileRoute }));
    },
    setFileList(fileList: FileType[]) {
      dispatch(setFileList({ fileList }));
    },
    setFocus(focusId: string) {
      dispatch(setFocus({ focusId }));
    },
    setLinkmanProperty(linkmanId: string, key: string, value: any) {
      dispatch(setLinkmanProperty({ linkmanId, key, value }));
    },
    addLinkmanMessage(linkmanId: string, message: Message) {
      dispatch(addLinkmanMessage({ linkmanId, message }));
    },
    deleteMessage(linkmanId: string, messageId: string) {
      dispatch(deleteMessage({ linkmanId, messageId }));
    },
    updateMessage(linkmanId: string, messageId: string, value: any) {
      dispatch(updateMessage({ linkmanId, messageId, value }));
    },
    addLinkman(linkman: Linkman, isFocus: boolean) {
      dispatch(addLinkman({ linkman, isFocus }));
    },
  };
}
