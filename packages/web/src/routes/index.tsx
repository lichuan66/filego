import React from "react";
import { RouteObject, Navigate } from "react-router-dom";
import Login from "../pages/LoginSignup/Login";
import Register from "../pages/LoginSignup/Register";
import Layout from "../pages/Layout/Layout";
import Home from "../pages/Home/Home";
import Aigpt from "../pages/Aigpt/Aigpt";

const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "aigpt",
        element: <Aigpt />,
      },
      {
        index: true, // 表示这是默认的子路由
        element: <Navigate to="/login" replace />,
      },
    ],
  },
];

export default routes;
