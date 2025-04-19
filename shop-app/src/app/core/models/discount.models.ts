export interface Discount {
    id: string;
    code: string;
    name: string;
    description?: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    value: number;
    validFrom: Date;
    validTo: Date;
    applicableTo: 'PRODUCT' | 'ORDER';
    applicableProductIds?: string[];
    minOrderAmount?: number;
    isActive: boolean;
  }