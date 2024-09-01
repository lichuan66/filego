import React, { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  showHeader: boolean;
  onClose: (val: boolean) => void;
  onOk?: () => void;
  children?: React.ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  onOk = () => {},
  children,
  title = "",
  showHeader = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className=" fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto outline-none focus:outline-none bg-gray-900 bg-opacity-50"
      onClick={() => onClose(false)}
    >
      <div
        className="relative min-w-[500px] my-6 mx-auto max-w-3xl bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {!showHeader && (
          <header className="flex flex-row justify-end items-center px-2 py-1 bg-slate-200 rounded-tl-lg rounded-tr-lg">
            <button className="ml-1 w-[18px] h-[18px] rounded-[50%] flex justify-center items-center text-white bg-green-500 outline-none focus:outline-none"></button>
            <button className="ml-1 w-[18px] h-[18px] rounded-[50%] flex justify-center items-center text-white bg-yellow-400 outline-none focus:outline-none"></button>
            <button
              className="ml-1 w-[18px] h-[18px] rounded-[50%] flex justify-center items-center text-white bg-red-500 outline-none focus:outline-none"
              onClick={() => onClose(false)}
            ></button>
          </header>
        )}
        {showHeader && (
          <header className="flex flex-row justify-center items-center px-2 py-1 bg-slate-200 rounded-tl-lg rounded-tr-lg">
            <span>{title}</span>
          </header>
        )}
        <section className="min-h-[150px] py-4 flex justify-center items-center">
          {children}
        </section>
        <footer className="flex flex-row justify-center items-center px-2 py-4 pb-[40px]">
          <button
            className="  bg-sky-100 text-blue-500 py-1 px-10 rounded-2xl hover:bg-blue-300"
            onClick={() => onClose(false)}
          >
            取消
          </button>
          <button
            className="ml-8 bg-blue-500 text-white py-1 px-10 rounded-2xl hover:bg-blue-300"
            onClick={onOk}
          >
            确认
          </button>
        </footer>
      </div>
    </div>
  );
}
