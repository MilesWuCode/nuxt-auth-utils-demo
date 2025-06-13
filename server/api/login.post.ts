import { z } from 'zod'
import { getExpiredAt, randomString } from '#shared/utils/auth'

const invalidCredentialsError = createError({
  statusCode: 401,
  // This message is intentionally vague to prevent user enumeration attacks.
  message: 'Invalid credentials',
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(
    event,
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }).parse,
  )

  if (email !== 'miles@email.com' || password !== 'password123') {
    throw invalidCredentialsError
  }

  await setUserSession(event, {
    user: {
      id: Math.floor(Math.random() * 10000).toString(),
      name: 'miles',
      email: email,
    },
    token: {
      accessToken: randomString(),
      accessTokenExpiredAt: getExpiredAt(60),
      refreshToken: randomString(),
      refreshTokenExpiredAt: getExpiredAt(120),
    },
    loggedInAt: Date.now(),
  })

  return setResponseStatus(event, 201)
})
