import React from "react";
import ButtonLayer from "./ButtonLayer";
import RouteLayer from "./RouteLayer";
import FilesLayer from "./FilesLayer";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col">
      <ButtonLayer />
      <RouteLayer />
      <FilesLayer />
    </div>
  );
}
