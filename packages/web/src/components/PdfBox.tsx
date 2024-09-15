import React, { useEffect, useRef, useState } from "react";
import { useFileRoute } from "../hook/useFile";
import { getToken } from "../api/auth";
import config from "@filego/config/client";
import Loading from "./Loading";

import * as pdfJS from "pdfjs-dist/legacy/build/pdf.js";
pdfJS.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.js";

type PdfBoxProps = {
  name: string;
};

export default function PdfBox({ name }: PdfBoxProps) {
  const userApi = `http://${config.Server}/api/fileManager`;
  const fileRoute = useFileRoute();
  const boxRef = useRef(null);
  const divRef = useRef(null);
  const [boxHeight, setBoxHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  let pageHeight = 0;
  let clientWidth = 0;
  let pdfObj: any = null;
  let showPageList: number[] = [];

  const route = fileRoute[fileRoute.length - 1].href;
  const url = `${userApi}/readPdf?route=${route}&fileName=${name}&username=${getToken()}`;

  async function renderPage(pageNum: number) {
    const page = await pdfObj.getPage(pageNum);
    const scale = 1; //缩放倍数，1表示原始大小
    const rotation = 0;
    const viewport = page.getViewport({ scale, rotation });
    pageHeight = viewport.height;
    clientWidth =
      // @ts-ignore
      clientWidth > 0 ? clientWidth : divRef?.current?.clientWidth;
    const xOffset = Math.floor((clientWidth - viewport.width) / 2);
    const div = document.getElementById(`pageItem_${pageNum}`);
    const canvas = document.createElement(`canvas`);
    if (div && canvas) {
      div.style.marginLeft = `${xOffset}px`;
      div.style.padding = "5px";
      div.style.height = `${viewport.height + 10}px`;
      canvas.setAttribute("id", `canvas_${pageNum}`);
      canvas.setAttribute("className", "");
      // @ts-ignore
      const context = canvas.getContext("2d"); //创建绘制canvas的对象
      // @ts-ignore
      canvas.width = viewport.width;
      // @ts-ignore
      canvas.height = viewport.height;
      // @ts-ignore
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      div.appendChild(canvas);
      page.render(renderContext as any);
      showPageList.push(pageNum);
    }
  }

  async function handleScrolls(e: any) {
    const tempNum =
      Math.floor((e.target?.scrollTop as number) / (pageHeight + 10)) + 1;
    console.log(
      "tempNum",
      tempNum,
      e.target?.scrollTop,
      (e.target?.scrollTop as number) / pageHeight
    );
    const start = tempNum - 3;
    const end = tempNum + 3;
    const newShowPageList = [];
    for (let i = start; i <= end; i++) {
      if (i <= 0) continue;
      newShowPageList.push(i);
    }
    for (let page of newShowPageList) {
      if (!showPageList.includes(page)) {
        const div = document.getElementById(`pageItem_${page}`);
        // @ts-ignore
        if (!div.firstChild) {
          await renderPage(page);
          console.log("add ", page, tempNum, newShowPageList, showPageList);
        }
      }
    }
    for (let page of showPageList) {
      if (!newShowPageList.includes(page) && Math.abs(tempNum - page) > 5) {
        const div = document.getElementById(`pageItem_${page}`);
        // @ts-ignore
        while (div.firstChild) {
          // @ts-ignore
          div.removeChild(div.firstChild);
        }
      } else {
        newShowPageList.push(page);
      }
    }
    showPageList = [...new Set(newShowPageList)];
  }

  useEffect(() => {
    async function readPdfHandler() {
      pdfJS.getDocument(url).promise.then(async (pdf) => {
        setLoading(false);
        pdfObj = pdf;
        const pagesNum = pdfObj.numPages;
        if (pagesNum > 0) {
          for (let i = 1; i <= pagesNum; i++) {
            const div = document.createElement("div");
            div.setAttribute("id", `pageItem_${i}`);
            // @ts-ignore
            divRef.current?.appendChild(div);
          }
          for (let i = 1; i <= 5; i++) {
            await renderPage(i);
          }
        }
      });
    }

    console.log(route, name, url);

    if (boxRef.current) {
      // @ts-ignore
      setBoxHeight(boxRef.current.clientHeight);
    }

    window.addEventListener("scroll", handleScrolls, true);

    readPdfHandler();

    return () => {
      window.removeEventListener("scroll", handleScrolls, true);
    };
  }, []);

  return (
    <div className="w-full h-full relative   bg-[#f8f9fc]" ref={boxRef}>
      {loading && <Loading />}
      <div
        style={{ height: `${boxHeight}px` }}
        className={`w-full overflow-auto`}
      >
        <div className={`mt-[14px] w-full `} ref={divRef}></div>
      </div>
    </div>
  );
}
