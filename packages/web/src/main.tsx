import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store/store";
import "./socket";

const root = createRoot(document.getElementById("app") as HTMLElement);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
  // </React.StrictMode>
);
