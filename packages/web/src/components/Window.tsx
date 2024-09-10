import React, { useState, useEffect, useRef } from "react";
import Tooltip from "../components/Tooltip";

type WindowProps = {
  children: React.ReactNode;
  isOpen: boolean;
  title: string;
  onClose: (val: boolean) => void;
};

export default function Window({
  children,
  title,
  isOpen,
  onClose,
}: WindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMiddle, setShowMiddle] = useState(true);
  const modalRef = useRef(null);

  // 获取视口尺寸
  const getViewSize = () => ({
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  });

  // 获取元素尺寸
  const getElementSize = (element: any) => ({
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  const handleDragStart = (e: any) => {
    if (!showMiddle) return;

    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;

    const moveAt = (e: any) => {
      setPosition({
        x: e.clientX - offsetX,
        y: e.clientY - offsetY,
      });
    };

    window.addEventListener("mousemove", moveAt);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", moveAt);
    });
  };

  function selectHandler() {
    if (modalRef.current) {
      // @ts-ignore
      //   modalRef.current.style.zIndex = "9999";
    }
  }

  function showSize(e: any) {
    e.stopPropagation();
    console.log(e.target, 1234);
    setShowMiddle(!showMiddle);
  }

  useEffect(() => {
    if (modalRef.current) {
      // 初始化位置到屏幕中央
      const viewSize = getViewSize();
      const elemSize = getElementSize(modalRef.current);
      setPosition({
        x: Math.floor(viewSize.width / 2 - elemSize.width / 2),
        y: Math.floor(viewSize.height / 2 - elemSize.height / 2),
      });
    }
  }, []);

  useEffect(() => {
    if (modalRef.current) {
      // @ts-ignore
      modalRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  return (
    isOpen && (
      <div
        ref={modalRef}
        style={{
          transform: `translate(${showMiddle ? position.x : 0}px, ${
            showMiddle ? position.y : 0
          }px)`,
          top: 0,
          left: 0,
        }}
        className="absolute z-50"
        onClick={selectHandler}
      >
        <div
          className={`
          relative  rounded-lg
         bg-white shadow-lg flex flex-col ${
           showMiddle ? "" : "w-screen h-screen"
         }`}
        >
          <header
            className="flex flex-row justify-end items-center px-2 py-1 bg-slate-200 rounded-tl-lg rounded-tr-lg cursor-pointer"
            onMouseDown={handleDragStart}
            onDoubleClick={showSize}
          >
            <span className="mr-auto font-bold text-xs pl-2">{title}</span>
            <Tooltip placement="top" overlay={<span>最小化</span>}>
              <button className="ml-1 w-[18px] h-[18px] rounded-[50%] flex justify-center items-center text-white bg-green-500 outline-none focus:outline-none"></button>
            </Tooltip>
            <Tooltip placement="top" overlay={<span>最大化</span>}>
              <button
                onClick={showSize}
                className="ml-1 w-[18px] h-[18px] rounded-[50%] flex justify-center items-center text-white bg-yellow-400 outline-none focus:outline-none"
              ></button>
            </Tooltip>
            <Tooltip placement="top" overlay={<span>关闭</span>}>
              <button
                onClick={() => onClose(false)}
                className="ml-1 w-[18px] h-[18px] rounded-[50%] flex justify-center items-center text-white bg-red-500 outline-none focus:outline-none"
              ></button>
            </Tooltip>
          </header>
          <section
            className={`${showMiddle ? "w-[500px] h-[500px]" : "flex-1"}`}
          >
            {children}
          </section>
        </div>
      </div>
    )
  );
}
