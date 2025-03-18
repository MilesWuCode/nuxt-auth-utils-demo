import {
  randomString,
  createAccessTokenExpiredAt,
  createRefreshTokenExpiredAt,
} from "~/utils/demo";
import { isExpired } from "~/utils/help";

export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp();

  // Don't run on client hydration when server rendered
  if (
    import.meta.client &&
    nuxtApp.isHydrating &&
    nuxtApp.payload.serverRendered
  ) {
    return;
  }

  const { loggedIn, session, clear } = useUserSession();

  // 未登入
  if (!loggedIn.value) {
    return;
  }

  if (
    session.value.token &&
    isExpired(session.value.token.accessTokenExpiredAt) &&
    isExpired(session.value.token.refreshTokenExpiredAt)
  ) {
    // 二個都過期則清空session
    await clear();
  } else if (
    session.value.token &&
    isExpired(session.value.token.accessTokenExpiredAt)
  ) {
    // 更換token
    session.value.token.accessToken = randomString();
    session.value.token.accessTokenExpiredAt = createAccessTokenExpiredAt();
    session.value.token.refreshToken = randomString();
    session.value.token.refreshTokenExpiredAt = createRefreshTokenExpiredAt();
  }
});
