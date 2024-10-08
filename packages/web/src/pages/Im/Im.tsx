import React, { useState } from "react";
import ImMenu from "./ImMenu";
import ImLinkList from "./ImLinkList";
import Imchat from "./ImChat";

export default function Im() {
  const [imMenuIndex, setImMenuIndex] = useState(1);

  return (
    <div className=" w-full h-full rounded-lg p-2 bg-[#eee] flex flex-row">
      <div className="w-36 bg-white">
        <ImMenu setImMenuIndex={setImMenuIndex} imMenuIndex={imMenuIndex} />
      </div>
      <div className="w-100 bg-white mx-1">
        <ImLinkList />
      </div>
      <div className="flex-auto bg-white relative">
        <Imchat />
      </div>
    </div>
  );
}
