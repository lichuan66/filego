import { state } from "../store/store";
import { selectCount } from "../store/reducers/pageSlice";
import { useSelector } from "react-redux";

export function useStore() {
  return useSelector(selectCount);
}

export function usePageType() {
  const { pageType } = useStore();
  return pageType;
}

export function useSiderBarOpen() {
  const { siderBarOpen } = useStore();
  return siderBarOpen;
}
