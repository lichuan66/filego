import React, { useEffect, useState } from "react";
import { useFileRoute } from "../hook/useFile";
import { readText } from "../api/fileManager";
import Loading from "./Loading";

type TextBoxProps = {
  name: string;
};

export default function TextBox({ name }: TextBoxProps) {
  const fileRoute = useFileRoute();
  const route = fileRoute[fileRoute.length - 1].href;
  const [contentList, setContentList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function readTextHandler() {
      const res = await readText(route, name);
      setContentList(res);
      setLoading(false);
    }

    readTextHandler();
  }, []);

  return (
    <div className="w-full h-full p-4 overflow-auto">
      {loading && <Loading />}(
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
      )
    </div>
  );
}
