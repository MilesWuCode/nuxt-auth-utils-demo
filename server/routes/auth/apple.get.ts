import { getCookie } from "h3";
import { getExpiredAt, randomString } from "#shared/utils/auth";

// export default defineOAuthAppleEventHandler({
//   async onSuccess(event, { user, tokens }) {
//     const userToSet = user?.name?.firstName && user?.name?.lastName
//       ? `${user.name.firstName} ${user.name.lastName}`
//       : user?.name?.firstName || user?.name?.lastName || tokens.email || tokens.sub

//     await setUserSession(event, {
//       user: {
//         apple: userToSet,
//       },
//       loggedInAt: Date.now(),
//     })

//     return sendRedirect(event, '/')
//   },
// })

export default defineOAuthAppleEventHandler({
  async onSuccess(event, { user, tokens }) {
    // cookie取返回頁路徑
    const redirectedFrom = getCookie(event, "redirectedFrom") ?? "/";

    console.log(user);
    console.log(tokens.id_token);

    await setUserSession(event, {
      user: {
        name: user.name,
      },
      token: {
        accessToken: randomString(),
        accessTokenExpiredAt: getExpiredAt(7 * 86400),
        refreshToken: randomString(),
        refreshTokenExpiredAt: getExpiredAt(30 * 86400),
      },
      loggedInAt: Date.now(),
    });

    return sendRedirect(event, redirectedFrom);
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Apple OAuth error:", error);

    return sendRedirect(event, "/");
  },
});
