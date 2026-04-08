declare module '#auth-utils' {
  interface User {
    id: string
    name: string
    email: string
    fetched_at: number
  }

  interface UserSession {
    token: {
      accessToken: string
      accessTokenExpiredAt: number
      refreshToken: string
      refreshTokenExpiredAt: number
    }
    loggedInAt: number
  }

  // interface SecureSessionData {}
}

export {}
