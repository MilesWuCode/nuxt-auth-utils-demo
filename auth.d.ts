declare module "#auth-utils" {
  interface User {
    id: string;
    name: string;
    email: string;
  }

  interface UserSession {
    user: {
      id: string;
      name: string;
      email: string;
    };
    token?: {
      accessToken: string;
      accessTokenExpiredAt: number;
      refreshToken: string;
      refreshTokenExpiredAt: number;
    };
    loggedInAt: number;
  }

  interface SecureSessionData {
    token?: {
      accessToken: string;
      accessTokenExpiredAt: number;
      refreshToken: string;
      refreshTokenExpiredAt: number;
    };
  }
}

export {};
