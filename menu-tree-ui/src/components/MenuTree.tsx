import { Menu } from "@/types/menu";
import MenuNode from "./MenuNode";

interface Props {
  menus: Menu[];
  selectedId?: string | null;
  onSelect?: (menu: Menu) => void;
  onAdd?: (parentMenu: Menu) => void;
  onRemove?: (id: string) => void;
  forceOpen?: boolean;
}

export default function MenuTree({
  menus,
  selectedId,
  onSelect,
  onAdd,
  onRemove,
  forceOpen,
}: Props) {
  return (
    <div className="space-y-1">
      {menus.map((menu, idx) => (
        <MenuNode
          key={menu.id}
          menu={menu}
          selectedId={selectedId}
          onSelect={onSelect}
          onAdd={onAdd}
          onRemove={onRemove}
          forceOpen={forceOpen}
          isLast={idx === menus.length - 1}
        />
      ))}
    </div>
  );
}
