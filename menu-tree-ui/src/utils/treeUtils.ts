import { Menu } from "@/types/menu";

export function findMenuById(menus: Menu[], id: string): Menu | null {
  for (const m of menus) {
    if (m.id === id) return m;
    if (m.children) {
      const found = findMenuById(m.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function findParent(menus: Menu[], childId: string): Menu | null {
  for (const m of menus) {
    if (m.children?.some((c) => c.id === childId)) return m;
    if (m.children) {
      const found = findParent(m.children, childId);
      if (found) return found;
    }
  }
  return null;
}

export function computeDepth(menus: Menu[], nodeId: string, depth = 0): number {
  for (const m of menus) {
    if (m.id === nodeId) return depth;
    if (m.children) {
      const d = computeDepth(m.children, nodeId, depth + 1);
      if (d >= 0) return d;
    }
  }
  return -1;
}

export const removeNodeFromTree = (tree: Menu[], id: string): Menu[] => {
  return tree
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: node.children
        ? removeNodeFromTree(node.children, id)
        : undefined,
    }));
};

export function filterTree(menus: Menu[], term: string): Menu[] {
  if (!term.trim()) return menus;
  const lowerTerm = term.toLowerCase();

  return menus
    .map((m) => {
      const matches = m.name.toLowerCase().includes(lowerTerm);
      const filteredChildren = m.children ? filterTree(m.children, term) : [];
      if (matches || filteredChildren.length > 0) {
        return { ...m, children: filteredChildren };
      }
      return null;
    })
    .filter((m): m is any => m !== null);
}
