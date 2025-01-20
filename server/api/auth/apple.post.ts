import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { idToken } = await readValidatedBody(
    event,
    z.object({
      idToken: z.string(),
    }).parse
  );

  const { sub, email } = parseJwt(idToken);

  await setUserSession(event, {
    user: {
      id: sub,
      name: email,
      email: email,
    },
    loggedInAt: Date.now(),
  });

  return setResponseStatus(event, 201);
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
