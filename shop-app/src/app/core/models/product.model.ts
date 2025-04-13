export interface Product {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    categoryId: number;
    categoryName: string;
    brandId: number;
    brandName: string;
    images: string[];
    productItems: ProductItem[];
    collapsed?: boolean;
  }
  
  export interface ProductItem {
    id: number;
    sku: string;
    price: number;
    newPrice: number;
    stock: number;
    colorId: number;
    colorName: string;
    hexCode: string;
    sizeId: number;
    sizeName: string;
    materialId: number;
    materialName: string;
    discountId: number | null;
    discountPercent: number | null;
    sold: number;
    status: 'ACTIVE' | 'SOLDOUT' | 'INACTIVE';
  }

  export interface ProductImage {
    id?: number;
    imageUrl: string;
    isMain: boolean;
    isNew?: boolean;
  }