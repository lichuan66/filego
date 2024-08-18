import React from "react";
import Checkbox from "./Checkbox";

interface Table {
  data: Array<{ [key: string]: any }>;
  columns: Array<{ key: string; label: string }>;
  children?: (rowData: any, columns: any) => JSX.Element;
  className?: string;
}

function TableRow({ rowData, columns }: { rowData: any; columns: any }) {
  return (
    <tr key={rowData.id}>
      <td className="text-left text-[14px]" key="id">
        <Checkbox className="rounded-full w-30 h-30" />
      </td>
      {columns.map((column: any) => (
        <td className="text-left text-[14px]" key={column.key}>
          {rowData[column.key]}
        </td>
      ))}
    </tr>
  );
}

export default function Table({
  data,
  columns,
  children,
  className = "",
}: Table) {
  let renderItem = (rowData: any, columns: any) => (
    <TableRow key={rowData.id} rowData={rowData} columns={columns} />
  );

  if (children) {
    renderItem = children;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th
            className=" h-[36px] flex flex-row justify-center items-center text-[14px]"
            key="_checkbox"
          >
            <Checkbox className="rounded-full w-30 h-30" />
          </th>
          {columns.map((columns) => (
            <th className="h-[36px]  text-left text-[14px]" key={columns.key}>
              {columns.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(
          (rowData) => renderItem(rowData, columns)
          // <TableRow key={rowData.id} rowData={rowData} columns={columns} />
        )}
      </tbody>
    </table>
  );
}
