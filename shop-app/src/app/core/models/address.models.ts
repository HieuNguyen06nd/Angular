export interface AddressRequest {
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detail: string;
    isDefault: boolean;
  }
  
  export interface UserSummary {
    id: number;
    email: string;
    fullName: string;
  }
  
  export interface AddressResponse {
    id: number;
    user: UserSummary;
    fullName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detail: string;
    isDefault: boolean;
  }