export interface Menu {
  id: string;
  name: string;
  parent_id?: string | null;
  order: number;
  depth?: number;
  children?: Menu[];
}
