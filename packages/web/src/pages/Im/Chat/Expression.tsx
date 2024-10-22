import React from "react";
import Tabs from "../../../components/Tabs";
import expression from "@filego/utils/expression";
// import BaiduImage from "../../../assets/images/baidu.png";

interface ExpressionProps {
  onSelectText: (expression: string) => void;
}

export default function Expression(props: ExpressionProps) {
  const { onSelectText } = props;

  const BaiduImage = require("../../../assets/images/baidu.png");

  const renderDefaultExpression = (
    <div className="w-full h-full flex flex-row flex-wrap px-[7px] py-0">
      {expression.default.map((e, index) => (
        <div
          key={e}
          data-name={e}
          onClick={(event) => {
            onSelectText(event.currentTarget.dataset.name as string);
          }}
          className="w-[40px] h-[40px] p-[5px] hover:bg-[#e9e9e9] hover:cursor-pointer"
        >
          <div
            className={`w-[30px] h-[30px]`}
            style={{
              backgroundImage: `url(${BaiduImage})`,
              backgroundPosition: `left ${-30 * index}px`,
              backgroundSize: "cover",
            }}
          ></div>
        </div>
      ))}
    </div>
  );

  const items = [
    {
      key: "default",
      label: <span className="text-[12px] py-2 px-3">表情包</span>,
      children: renderDefaultExpression,
    },
  ];

  return (
    <div className="w-full h-full">
      <Tabs
        tabPosition="top"
        items={items}
        defaultActiveKey="default"
        tabBarStyle={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: "40px",
        }}
        className="border-0 text-[16px]"
      ></Tabs>
    </div>
  );
}
