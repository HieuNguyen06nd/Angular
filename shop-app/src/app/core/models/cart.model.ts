
export interface Cart {
    id: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    cartItems: CartItem[];
    totalQuantity: number;
    totalPrice: number;
  }
  export interface CartItem {
      id: number;
      productItemId: number;
      name: string;
      imgUrl: string;
      sku: string;
      price: number;
      quantity: number;
      colorId: number;
      sizeId: number;
      colorName?: string;
      sizeName?: string;
      selected?: boolean; 
    }