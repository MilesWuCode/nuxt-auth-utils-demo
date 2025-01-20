import {
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
      await setUserSession(event, {
        ...session,
        token: {
          accessToken: "eee",
          accessTokenExpiredAt: createAccessTokenExpiredAt(),
          refreshToken: "fff",
          refreshTokenExpiredAt: createRefreshTokenExpiredAt(),
        },
      });
    }
  }
});
