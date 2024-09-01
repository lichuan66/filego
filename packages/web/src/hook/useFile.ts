import { state } from "../store/store";
import { selectCount } from "../store/reducers/fileSlice";
import { useSelector } from "react-redux";

export function useStore() {
  return useSelector(selectCount);
}

export function useFileRoute() {
  const { fileRoute } = useStore();
  return fileRoute;
}

export function useFileList() {
  const { fileList } = useStore();
  return fileList;
}
