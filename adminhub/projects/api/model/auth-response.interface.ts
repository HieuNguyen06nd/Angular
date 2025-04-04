
export interface AuthResponse {
    status: number;
    message: string;
    data: {
      token?: string;          // Đối với đăng nhập
      refreshToken?: string;   // Nếu có refresh token
      user?: any;              // Thông tin người dùng nếu có
      message?: string;        // Thông báo cho đăng ký
    };
  }
  