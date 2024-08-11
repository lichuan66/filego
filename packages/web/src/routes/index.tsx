import React from "react";
import { RouteObject } from "react-router-dom";
import Login from "@/pages/LoginSignup/Login.tsx";
import Register from "@/pages/LoginSignup/Register.tsx";
import Layout from "@/pages/Layout/Layout";
import Home from "@/pages/Home/Home";
import Aigpt from "@/pages/Aigpt/Aigpt";

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
    ],
  },
];

export default routes;
