import { z } from "zod";

const invalidCredentialsError = createError({
  statusCode: 401,
  message: "Invalid credentials",
});

export default defineEventHandler(async (event) => {
  const { name } = await readValidatedBody(
    event,
    z.object({
      name: z.string(),
    }).parse
  );

  const session = await getUserSession(event);

  if (session) {
    await setUserSession(event, {
      ...session,
      user: { ...session.user, name: name },
      loggedInAt: session.loggedInAt,
    });

    return setResponseStatus(event, 200);
  } else {
    throw invalidCredentialsError;
  }
});
