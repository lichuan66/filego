import { state } from "../store/store";
import { selectCount } from "../store/reducers/userSlice";
import { useSelector } from "react-redux";

export function useStore() {
  return useSelector(selectCount);
}

export function useUsername() {
  const { user } = useStore();
  if (!user) return "";
  return user.username;
}

export function useSelfId() {
  const { user } = useStore();
  if (!user) return "";
  return user._id;
}

export function useAvatar() {
  const { user } = useStore();
  if (!user) return "";
  return user.avatar;
}

export function useLinkmans() {
  const { linkmans } = useStore();
  return linkmans;
}

export function useFocus() {
  const { focus } = useStore();
  return focus;
}
