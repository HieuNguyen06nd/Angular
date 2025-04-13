export interface Category {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    active: boolean;
    parent?: Category;
    children: Category[];
    collapsed?: boolean;
  }
  