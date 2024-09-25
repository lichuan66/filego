import React, { useState } from "react";
import ImMenu from "./ImMenu";

export default function Im() {
  const [imMenuIndex, setImMenuIndex] = useState(1);

  return (
    <div className="w-full h-full rounded-lg p-2 bg-[#eee] flex flex-row">
      <div className="w-48 bg-white">
        <ImMenu setImMenuIndex={setImMenuIndex} imMenuIndex={imMenuIndex} />
      </div>
      <div className="w-60 bg-blue-200"></div>
      <div className="flex-auto bg-green-200"></div>
    </div>
  );
}
