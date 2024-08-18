import { useDispatch } from "react-redux";

import {
  setPageType,
  setWidthAndHeight,
  setSiderBarOpen,
} from "../store/reducers/pageSlice";

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
  };
}
