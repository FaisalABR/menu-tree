"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Menu } from "@/types/menu";

interface Props {
  menu: Menu;
  level?: number;
  selectedId?: string | null;
  onSelect?: (menu: Menu) => void;
  onAdd?: (parentMenu: Menu) => void;
  onRemove?: (id: string) => void;
  forceOpen?: boolean;
  isLast?: boolean;
}

export default function MenuNode({
  menu,
  level = 0,
  selectedId,
  onSelect,
  onAdd,
  onRemove,
  forceOpen,
  isLast = false,
}: Props) {
  const [open, setOpen] = useState(true);
  const hasChildren = menu.children && menu.children.length > 0;
  const isSelected = selectedId === menu.id;

  useEffect(() => {
    if (forceOpen !== undefined) {
      setOpen(forceOpen);
    }
  }, [forceOpen]);

  return (
    <div className="relative group/node">
      {/* Connector lines from parent */}
      {level > 0 && (
        <span
          className="absolute border-l border-dashed border-gray-300 pointer-events-none"
          style={{
            left: (level - 1) * 24 + 32,
            top: 0,
            bottom: isLast ? "50%" : 0,
          }}
        />
      )}
      {level > 0 && (
        <span
          className="absolute border-t border-dashed border-gray-300 pointer-events-none"
          style={{
            left: (level - 1) * 24 + 32,
            width: 14,
            top: "50%",
          }}
        />
      )}

      {/* Node content row */}
      <div
        onClick={() => onSelect?.(menu)}
        className={`flex items-center gap-2 pr-3 py-2 rounded-xl border transition-all cursor-pointer group h-12 ${
          isSelected
            ? "bg-blue-50 border-blue-200 shadow-sm"
            : "bg-transparent border-transparent hover:bg-gray-50"
        }`}
        style={{ paddingLeft: level * 24 + 12 }}
      >
        {/* Toggle Chevron */}
        <div
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          {hasChildren ? (
            open ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            <div className="w-1 h-1 rounded-full bg-gray-300 ml-0.5" />
          )}
        </div>

        {/* Label */}
        <span
          className={`text-sm font-medium transition-colors ${
            isSelected ? "text-blue-700 font-semibold" : "text-gray-700"
          }`}
        >
          {menu.name}
        </span>

        {/* Action Buttons — visible on selected node or hover */}
        <div
          className={`ml-auto flex items-center gap-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          {/* Add child button */}
          <button
            className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-md active:scale-95 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.(menu);
            }}
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && open && (
        <div className="mt-1">
          {menu.children!.map((child, idx) => (
            <MenuNode
              key={child.id}
              menu={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onAdd={onAdd}
              onRemove={onRemove}
              forceOpen={forceOpen}
              isLast={idx === menu.children!.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
