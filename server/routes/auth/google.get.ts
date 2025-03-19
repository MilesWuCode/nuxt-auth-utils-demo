import { getCookie } from "h3";
import {
  randomString,
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

    // cookie取返回頁路徑
    const redirectedFrom = getCookie(event, "redirectedFrom") ?? "/";

    await setUserSession(event, {
      user: {
        id: user.sub,
        name: user.name,
        email: user.email,
      },
      token: {
        accessToken: randomString(),
        accessTokenExpiredAt: createAccessTokenExpiredAt(), // test: 1min
        refreshToken: randomString(),
        refreshTokenExpiredAt: createRefreshTokenExpiredAt(),
      },
      loggedInAt: Date.now(),
    });

    return sendRedirect(event, redirectedFrom);
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Google OAuth error:", error);

    return sendRedirect(event, "/");
  },
});
