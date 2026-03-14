"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LayoutGrid,
  ChevronRight,
  Menu as MenuIcon,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import MenuTree from "@/components/MenuTree";
import Sidebar from "@/components/Sidebar";
import ConfirmDelete from "@/components/ConfirmDelete";
import ErrorToast from "@/components/ErrorToast";
import { useMenuStore } from "@/stores/menuStore";
import { Menu } from "@/types/menu";

import {
  findMenuById,
  findParent,
  computeDepth,
  filterTree,
} from "@/utils/treeUtils";

export default function Page() {
  const {
    menus,
    loading,
    fetchMenus,
    selectedMenu,
    setSelectedMenu,
    addMenu,
    editMenu,
    removeMenu,
    error,
    clearError,
  } = useMenuStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Expand/collapse all control: undefined = per-node, true = all open, false = all closed
  const [forceOpen, setForceOpen] = useState<boolean | undefined>(true);

  // Search term for filtering menus
  const [searchTerm, setSearchTerm] = useState("");

  // Right-panel form state
  const [formName, setFormName] = useState("");
  const [saving, setSaving] = useState(false);

  // Whether we are adding a NEW child (instead of editing existing)
  const [addingChildOf, setAddingChildOf] = useState<Menu | null>(null);
  const [isAddingRoot, setIsAddingRoot] = useState(false);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // Sync form when selected menu changes
  useEffect(() => {
    if (isAddingRoot) {
      setFormName("");
    } else if (addingChildOf) {
      setFormName("");
    } else if (selectedMenu) {
      setFormName(selectedMenu.name);
    } else {
      setFormName("");
    }
  }, [selectedMenu, addingChildOf, isAddingRoot]);

  const handleSelect = useCallback(
    (menu: Menu) => {
      setIsAddingRoot(false);
      setAddingChildOf(null);
      setSelectedMenu(menu);
    },
    [setSelectedMenu],
  );

  const handleAdd = useCallback((parentMenu: Menu) => {
    setIsAddingRoot(false);
    setAddingChildOf(parentMenu);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setShowDeleteConfirm(id);
  }, []);

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await removeMenu(showDeleteConfirm);
      setSelectedMenu(null);
      setShowDeleteConfirm(null);
    }
  };

  const handleAddRoot = () => {
    setSelectedMenu(null);
    setAddingChildOf(null);
    setIsAddingRoot(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    try {
      if (isAddingRoot) {
        await addMenu({ name: formName.trim(), parent_id: null });
        setIsAddingRoot(false);
      } else if (addingChildOf) {
        await addMenu({ name: formName.trim(), parent_id: addingChildOf.id });
        setAddingChildOf(null);
      } else if (selectedMenu) {
        await editMenu(selectedMenu.id, { name: formName.trim() });
        // Refresh selected menu data
        const updated = findMenuById(
          useMenuStore.getState().menus,
          selectedMenu.id,
        );
        if (updated) setSelectedMenu(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredMenus = filterTree(menus, searchTerm);

  // Compute depth and parent for the right panel
  const activeMenuId = isAddingRoot
    ? "__root__"
    : addingChildOf
      ? "__new__"
      : (selectedMenu?.id ?? null);
  const depth = isAddingRoot
    ? 0
    : addingChildOf
      ? computeDepth(menus, addingChildOf.id) + 1
      : selectedMenu
        ? computeDepth(menus, selectedMenu.id)
        : null;

  const parent = selectedMenu
    ? findParent(menus, selectedMenu.id)
    : (addingChildOf ?? null);

  const displayId =
    isAddingRoot || addingChildOf
      ? "(auto-generated)"
      : (selectedMenu?.id ?? "");

  if (loading && menus.length === 0) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-400 text-sm animate-pulse">Loading…</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-x-hidden">
        {/* Breadcrumb bar */}
        <div className="flex items-center justify-between px-4 lg:px-8 py-4 bg-white/50 backdrop-blur-sm border-b border-gray-200 lg:border-none">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 -ml-1 mr-2 text-gray-600 lg:hidden hover:bg-gray-200 rounded transition-colors"
            >
              <MenuIcon size={20} />
            </button>
            <div className="flex items-center gap-1.5 opacity-60">
              <LayoutGrid size={14} />
              <span>/</span>
              <span className="font-medium text-gray-900">Menus</span>
            </div>
          </div>
        </div>

        {/* Page header */}
        <div className="px-4 lg:px-8 pb-6 pt-6 lg:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <LayoutGrid size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Menus
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Manage your application navigation
                </p>
              </div>
            </div>

            <button
              onClick={handleAddRoot}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Plus size={18} />
              Add Root Menu
            </button>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search menus..."
                className="w-full bg-white border border-gray-200 rounded-full pl-11 pr-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md active:scale-95 ${
                  forceOpen === true
                    ? "bg-[#101828] text-white shadow-lg shadow-gray-300"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setForceOpen(true)}
              >
                Expand All
              </button>
              <button
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md active:scale-95 ${
                  forceOpen === false
                    ? "bg-[#101828] text-white shadow-lg shadow-gray-300"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setForceOpen(false)}
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Two-panel card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col lg:flex-row overflow-hidden min-h-[500px]">
            {/* Left: Tree */}
            <div className="flex-1 border-b lg:border-b-0 lg:border-r border-gray-100 p-6 lg:p-10">
              <div className="tree-scroll overflow-y-auto max-h-[50vh] lg:max-h-[60vh] pr-2">
                <MenuTree
                  menus={filteredMenus}
                  selectedId={activeMenuId}
                  onSelect={handleSelect}
                  onAdd={handleAdd}
                  forceOpen={forceOpen}
                />
                {filteredMenus.length === 0 && !loading && (
                  <div className="py-12 text-center text-gray-400">
                    <p className="text-sm">
                      No menus found matching "{searchTerm}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Detail panel */}
            <div className="w-full lg:w-[400px] shrink-0 p-6 lg:p-10 bg-gray-50/40 flex flex-col gap-6">
              {selectedMenu || addingChildOf || isAddingRoot ? (
                <>
                  {/* Menu ID */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">
                      Menu ID
                    </label>
                    <div className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-3.5 text-sm text-gray-400 break-all leading-relaxed shadow-sm">
                      {displayId}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Depth */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">
                        Depth
                      </label>
                      <div className="w-full rounded-2xl border border-gray-100 bg-gray-100 px-5 py-3.5 text-sm text-gray-600 font-bold text-center">
                        {depth !== null ? depth : "—"}
                      </div>
                    </div>

                    {/* Parent Data */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">
                        Parent
                      </label>
                      <div className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-3.5 text-sm text-gray-800 font-bold shadow-sm whitespace-nowrap overflow-hidden text-ellipsis text-center">
                        {parent?.name ?? "(None)"}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">
                      Menu Name
                    </label>
                    <input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder={
                        isAddingRoot
                          ? "Root menu name…"
                          : addingChildOf
                            ? "Child menu name…"
                            : "Menu name"
                      }
                      className="w-full rounded-2xl border border-gray-200 px-5 py-3.5 text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-col gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving || !formName.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-extrabold rounded-full py-4 text-sm transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                      {saving
                        ? "Saving…"
                        : selectedMenu && !addingChildOf && !isAddingRoot
                          ? "Update Menu"
                          : "Create Menu"}
                    </button>

                    {selectedMenu && !addingChildOf && !isAddingRoot && (
                      <button
                        onClick={() => handleRemove(selectedMenu.id)}
                        className="w-full text-red-500 hover:text-red-600 font-bold text-sm py-2 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete Menu
                      </button>
                    )}

                    {(addingChildOf || isAddingRoot) && (
                      <button
                        onClick={() => {
                          setAddingChildOf(null);
                          setIsAddingRoot(false);
                        }}
                        className="w-full text-sm text-gray-400 hover:text-gray-600 font-bold py-2 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-300 text-sm gap-6 py-12">
                  <div className="p-6 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex items-center justify-center">
                    <LayoutGrid size={48} className="text-gray-100" />
                  </div>
                  <div className="text-center">
                    <p className="font-extrabold text-gray-400 text-base">
                      No Menu Selected
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                      Select an item to edit or view its properties
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <ConfirmDelete
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={confirmDelete}
        itemName={
          showDeleteConfirm
            ? findMenuById(menus, showDeleteConfirm)?.name || ""
            : ""
        }
      />
      <ErrorToast message={error} onClear={clearError} onRetry={fetchMenus} />
    </div>
  );
}
