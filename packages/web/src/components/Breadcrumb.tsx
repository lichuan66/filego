import React from "react";
import useAction from "../hook/useAction";

type PropsType = {
  items: { label: string; href: string }[];
};

export default function Breadcrumb({ items }: PropsType) {
  const { setFileRoute } = useAction();

  /** 路由跳转 */
  function gotoRoute(index: number) {
    if (index === items.length - 1) {
      return;
    }
    setFileRoute(items.slice(0, index + 1));
  }

  return (
    <nav className="flex gap-2 text-[12px] text-sky-400">
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {
              <span
                onClick={() => gotoRoute(index)}
                className={` ${
                  !isLastItem ? "text-sky-400 cursor-pointer" : "text-black"
                }`}
              >
                {item.label}
              </span>
            }
            {!isLastItem && <span>/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
