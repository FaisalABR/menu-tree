import { create } from "zustand";
import { Menu } from "@/types/menu";
import * as api from "@/services/menuApi";

interface State {
  menus: Menu[];
  loading: boolean;
  error: string | null;
  selectedMenu: Menu | null;
  fetchMenus: () => Promise<void>;
  setSelectedMenu: (menu: Menu | null) => void;
  addMenu: (data: { name: string; parent_id?: string | null }) => Promise<void>;
  editMenu: (id: string, data: { name: string }) => Promise<void>;
  removeMenu: (id: string) => Promise<void>;
  clearError: () => void;
}

import { removeNodeFromTree, findMenuById } from "@/utils/treeUtils";

export const useMenuStore = create<State>((set, get) => ({
  menus: [],
  loading: false,
  error: null,
  selectedMenu: null,

  fetchMenus: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.getMenus();
      set({ menus: res.data.data, loading: false });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || err.message || "Failed to fetch menus",
        loading: false,
      });
    }
  },

  setSelectedMenu: (menu) => set({ selectedMenu: menu }),

  addMenu: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.createMenu(data);
      await get().fetchMenus();
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || err.message || "Failed to add menu",
        loading: false,
      });
    }
  },

  editMenu: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.updateMenu(id, data);
      await get().fetchMenus();
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || err.message || "Failed to update menu",
        loading: false,
      });
    }
  },

  removeMenu: async (id) => {
    const prevMenus = get().menus;
    const newMenus = removeNodeFromTree(prevMenus, id);
    set({ menus: newMenus, selectedMenu: null, error: null });

    try {
      await api.deleteMenu(id);
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || err.message || "Failed to delete menu",
        menus: prevMenus,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
