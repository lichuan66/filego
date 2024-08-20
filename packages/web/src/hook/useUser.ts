import { state } from "../store/store";
import { selectCount } from "../store/reducers/userSlcie";
import { useSelector } from "react-redux";

export function useStore() {
  return useSelector(selectCount);
}

export function useAvatar() {
  const { avatar } = useStore();
  const a = useStore();
  return avatar;
}
