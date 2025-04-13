export interface OrderItemResponse {
    id: number;
    productItemId: number;
    productId: number;
    productName: string;
    colorId: number;
    colorName: string;
    sizeId: number;
    sizeName: string;
    materialId: number;
    materialName: string;
    sku: string;
    quantity: number;
    price: number;
  }
  
  export interface OrderResponse {
    id: number;
    userId: number;
    addressId: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    discountId?: number;
    discountAmount?: number;
    orderItems: OrderItemResponse[];
  }
  