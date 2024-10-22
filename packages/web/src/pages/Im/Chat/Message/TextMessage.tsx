import React from "react";
import expression from "@filego/utils/expression";
import { TRANSPARENT_IMAGE } from "@filego/utils/const";
import BaiduImage from "../../../../assets/images/baidu.png";

interface TextMessageProps {
  content: string;
}

export default function TextMessage(props: TextMessageProps) {
  const { content } = props;

  const newContent = content.replace(/#\(([\u4e00-\u9fa5a-z]+)\)/g, (r, e) => {
    const index = expression.default.indexOf(e);
    if (index !== -1) {
      console.log(r, e, 1111);

      return `<img
      src="${TRANSPARENT_IMAGE}"
        class="w-[30px] h-[30px]"
        style="background-image: url('${BaiduImage}'); background-position: left ${
        -30 * index
      }px; background-size: cover; user-select: text; display: inline-block" alt='${r}'>`;
    }
    return r;
  });
  return <div dangerouslySetInnerHTML={{ __html: newContent }}></div>;
}
