import React from "react";
import FunctionBar from "./Linkman/FunctionBar";
import LinkmanList from "./Linkman/LinkmanList";

export default function ImLinkList() {
  return (
    <div className="w-full h-full overflow-auto">
      <FunctionBar />
      <LinkmanList />
    </div>
  );
}
