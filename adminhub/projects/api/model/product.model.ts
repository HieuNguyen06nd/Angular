export interface Product {
    id: number;
    categoryId?: number;
    brandId?: number;          // Thêm trường brandId
    categoryName?: string;
    brandName?: string;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    productItems: ProductItem[];
    images?: ProductImage[];
  }
  
  export interface ProductItem {
    id: number;
    sku: string;
    price: number;
    stock: number;
    colorName: string;
    sizeName: string;
    materialName: string;
    colorId?: number;
    sizeId?: number;
    materialId?: number;
    images?: ProductImage[];
  }
  
  export interface ProductImage {
    id?: number;
    imageUrl: string;
    isMain: boolean;
  }
  