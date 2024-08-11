import React from "react";
import Notification from "rc-notification";
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";

const toastConfig: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export default {
  success(text: string, duration = 3000) {
    toast.success(text, { ...toastConfig, autoClose: duration });
  },
  error(text: string, duration = 3000) {
    toast.error(text, { ...toastConfig, autoClose: duration });
  },
  warning(text: string, duration = 3000) {
    toast.warning(text, { ...toastConfig, autoClose: duration });
  },
  info(text: string, duration = 3000) {
    toast.info(text, { ...toastConfig, autoClose: duration });
  },
};
