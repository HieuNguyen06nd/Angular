// discount.model.ts
export interface DiscountResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  value: number;
  type: DiscountType;
  validFrom: string;
  validTo: string;
  applicableTo: ApplicableType;
  applicableProductIds?: number[];
  minOrderAmount?: number;
  isActive: boolean;
  status: DiscountStatus;
  createdAt: string;
}


export interface DiscountRequest {
  code: string;
  name: string;
  description?: string;
  value: number;
  type: DiscountType;
  validFrom: string;
  validTo: string;
  applicableTo: ApplicableType;
  applicableProductIds?: number[];
  minOrderAmount?: number;
  isActive: boolean;
}

export enum DiscountType {
  PERCENTAGE   = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export enum ApplicableType {
  PRODUCT = 'PRODUCT',
  ORDER   = 'ORDER',
}

export enum DiscountStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE   = 'ACTIVE',
  EXPIRED  = 'EXPIRED',
}
