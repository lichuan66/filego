import React, { useRef, useEffect, useState } from "react";

export default function ListLayer() {
  const [winHeight, setWinHeight] = useState(0);
  const divRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    const height = divRef.current.clientHeight - 50;
    if (height) {
      setWinHeight(height);
    }
  }, []);

  return (
    <div
      ref={divRef}
      className="flex-1 w-full  rounded-bl-lg rounded-br-lg flex flex-col"
    >
    </div>
  );
}
