import React, { useEffect, useState } from "react";
import { useFileRoute } from "../hook/useFile";
import { readText } from "../api/fileManager";
import Loading from "./Loading";
import Message from "./Message";

type TextBoxProps = {
  name: string;
  type?: string;
};

export default function TextBox({ name, type = "fileManager" }: TextBoxProps) {
  const fileRoute = useFileRoute();
  const route = fileRoute[fileRoute.length - 1].href;
  const [contentList, setContentList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function readTextHandler() {
      try {
        const res = await readText(route, name);
        setContentList(res);
        setLoading(false);
      } catch (error: any) {
        console.error(error);
        Message.error(error.message);
      }
    }

    async function fetchTextHandler() {
      try {
        const response = await fetch(name);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const res = await response.text();
        const contentList = res.split("\r\n");
        setContentList(contentList);
        setLoading(false);
      } catch (error: any) {
        console.error(error);
        Message.error(error.message);
      }
    }

    const request = type === "fileManager" ? readTextHandler : fetchTextHandler;

    request();
  }, []);

  return (
    <div className="w-full h-full p-4 overflow-auto">
      {loading && <Loading />}
      <table>
        <tbody>
          <tr>
            <td className="border-r-2 border-r-green-500">
              {contentList.map((elem, id) => {
                return (
                  <div
                    className="select-none cursor-default pr-2 text-xs"
                    key={id}
                  >
                    {id}
                  </div>
                );
              })}
            </td>
            <td>
              {contentList.map((elem, id) => {
                return (
                  <div className="pl-3 text-xs" key={id}>
                    {elem}
                  </div>
                );
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
