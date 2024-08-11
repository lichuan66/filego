import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <div className={` fixed top-0 left-0 right-0 bottom-0 `}>
      <RouterProvider router={router} />
    </div>
  );
}
