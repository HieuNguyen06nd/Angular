// src/app/auth/auth.models.ts
export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }
  
  export interface LoginRequest {
    emailOrPhone: string;
    password: string;
  }
  
  export interface AuthResponse {
    status: number;
    message: string;
    data: {
      token: string;
      userId: number;
    };
  }
  