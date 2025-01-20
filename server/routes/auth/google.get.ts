import {
  createAccessTokenExpiredAt,
  createRefreshTokenExpiredAt,
} from "~/utils/demo";

export default defineOAuthGoogleEventHandler({
  config: {
    authorizationParams: {
      access_type: "offline",
    },
  },
  async onSuccess(event, { user, tokens }) {
    // console.log(user, tokens);

    await setUserSession(event, {
      user: {
        id: user.sub,
        name: user.name,
        email: user.email,
      },
      token: {
        accessToken: "abc",
        accessTokenExpiredAt: createAccessTokenExpiredAt(), // test: 1min
        refreshToken: "def",
        refreshTokenExpiredAt: createRefreshTokenExpiredAt(),
      },
      loggedInAt: Date.now(),
    });

    return sendRedirect(event, "/");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Google OAuth error:", error);

    return sendRedirect(event, "/");
  },
});
