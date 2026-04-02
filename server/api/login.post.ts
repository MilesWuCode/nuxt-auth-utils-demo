import * as z from 'zod'
import { getExpiredAt, randomString } from '#shared/utils/auth'

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(
    event,
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }).parse,
  )

  if (email !== 'user@email.com' || password !== 'password') {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  await setUserSession(event, {
    user: {
      id: Math.floor(Math.random() * 10000).toString(),
      name: 'miles',
      email: email,
    },
    token: {
      accessToken: randomString(),
      accessTokenExpiredAt: getExpiredAt(5),
      refreshToken: randomString(),
      refreshTokenExpiredAt: getExpiredAt(10),
    },
    loggedInAt: Date.now(),
  })

  return setResponseStatus(event, 201)
})
