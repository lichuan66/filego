import React from "react";

export interface ItemProps {
  id: number;
  name: string;
  updateTime?: string;
  type?: string;
  iconPath?: string;
}

interface ListProps {
  items: Array<ItemProps>;
  headerName?: string;
  headerClassName?: string;
  itemClassName?: string;
  children?: (item: { id: number; name: string }) => JSX.Element;
  renderHeader?: () => JSX.Element;
}

function ListHeader({
  headerName,
  className,
}: {
  headerName: string;
  className?: string;
}) {
  return <header className={`${className}`}>{headerName}</header>;
}

function ListItem({
  item,
  className = "",
}: {
  item: ItemProps;
  className?: string;
}) {
  return (
    <li className={className} key={item.id}>
      {item.name}
    </li>
  );
}

export default function List({
  items,
  children,
  headerName,
  headerClassName = "",
  itemClassName = "",
}: ListProps) {
  let renderItem = (item: ItemProps) => (
    <ListItem item={item} className={itemClassName} />
  );

  if (children) {
    renderItem = children;
  }

  return (
    <div>
      {headerName && (
        <ListHeader headerName={headerName} className={headerClassName} />
      )}
      <ul>{items.map((item) => renderItem(item))}</ul>
    </div>
  );
}
