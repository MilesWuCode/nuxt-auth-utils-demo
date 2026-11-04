declare module '#auth-utils' {
  interface User {
    id: string
    name: string
    email: string
    fetched_at: number
  }

  interface UserSession {
    tokenExpiredAt?: {
      accessTokenExpiredAt: number
      refreshTokenExpiredAt: number
    }
    loggedInAt: number
  }

  interface SecureSessionData {
    accessToken: string
    refreshToken: string
  }
}

export {}
