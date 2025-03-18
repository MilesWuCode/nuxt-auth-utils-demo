import { z } from "zod";
import {
  randomString,
  createAccessTokenExpiredAt,
  createRefreshTokenExpiredAt,
} from "~/utils/demo";

const invalidCredentialsError = createError({
  statusCode: 401,
  // This message is intentionally vague to prevent user enumeration attacks.
  message: "Invalid credentials",
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(
    event,
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }).parse
  );

  if (email !== "miles@email.com" || password !== "password123") {
    throw invalidCredentialsError;
  }

  // accessToken
  // refreshToken

  await setUserSession(event, {
    user: {
      id: "fake.id",
      name: "miles",
      email: email,
    },
    token: {
      accessToken: randomString(128),
      accessTokenExpiredAt: createAccessTokenExpiredAt(),
      refreshToken: randomString(128),
      refreshTokenExpiredAt: createRefreshTokenExpiredAt(),
    },
    loggedInAt: Date.now(),
  });

  return setResponseStatus(event, 201);
});
