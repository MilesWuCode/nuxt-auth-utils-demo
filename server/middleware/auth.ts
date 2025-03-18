import {
  randomString,
  createAccessTokenExpiredAt,
  createRefreshTokenExpiredAt,
} from "~/utils/demo";
import { isExpired } from "~/utils/help";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (session) {
    if (
      session.token &&
      isExpired(session.token.accessTokenExpiredAt) &&
      isExpired(session.token.refreshTokenExpiredAt)
    ) {
      await clearUserSession(event);
    } else if (session.token && isExpired(session.token.accessTokenExpiredAt)) {
      // 交換新的token

      await setUserSession(event, {
        ...session,
        token: {
          accessToken: randomString(),
          accessTokenExpiredAt: createAccessTokenExpiredAt(),
          refreshToken: randomString(),
          refreshTokenExpiredAt: createRefreshTokenExpiredAt(),
        },
      });
    }
  }
});
