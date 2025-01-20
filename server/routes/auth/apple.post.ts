import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { id_token, state } = await readValidatedBody(
    event,
    z.object({
      code: z.string(),
      id_token: z.string(),
      state: z.string(),
    }).parse
  );

  const cookies = parseCookies(event);

  if (state === cookies.state) {
    const { sub, email } = parseJwt(id_token);

    await setUserSession(event, {
      user: {
        id: sub,
        name: email,
        email: email,
      },
      loggedInAt: Date.now(),
    });
  }

  sendRedirect(event, cookies.redirectedFrom || "/");
});

function parseJwt(idToken: string) {
  const base64Url = idToken.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
