export interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
    parent?: Category | null;
    children: Category[];
    createdAt: string;
    updatedAt: string;
  }
  