export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BANNED = 'BANNED'
}

export interface User {
  id: number;
  email: string;
  phone: string | null; 
  fullName: string | null; 
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
