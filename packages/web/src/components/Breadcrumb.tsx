import React from "react";
import { Link } from "react-router-dom";

type PropsType = {
  items: { label: string; href: string }[];
};

export default function Breadcrumb({ items }: PropsType) {
  return (
    <nav className="flex gap-2 text-[12px] text-sky-400">
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {!isLastItem ? (
              <Link to={item.href}>{item.label}</Link>
            ) : (
              <span className={!isLastItem ? "text-sky-400" : "text-black"}>
                {item.label}
              </span>
            )}
            {!isLastItem && <span>/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
