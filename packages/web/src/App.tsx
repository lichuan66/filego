import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import usePage from "./hook/useAction";

const router = createBrowserRouter(routes);

export default function App() {
  const { setPageType, setWidthAndHeight } = usePage();

  const handleResize = () => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const pageType = width <= 726 ? "phone" : "web";
    setWidthAndHeight(width, height);
    setPageType(pageType);
  };

  handleResize();

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // 清理函数，移除监听器
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={` fixed top-0 left-0 right-0 bottom-0 `}>
      <RouterProvider router={router} />
    </div>
  );
}
