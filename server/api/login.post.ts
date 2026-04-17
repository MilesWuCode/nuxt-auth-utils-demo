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
      id: '1',
      name: 'miles',
      email: email,
      fetched_at: Date.now(),
    },
    token: {
      accessToken: randomString(),
      accessTokenExpiredAt: getExpiredAt(10),
      refreshToken: randomString(),
      refreshTokenExpiredAt: getExpiredAt(86400),
    },
    loggedInAt: Date.now(),
  })

  setResponseStatus(event, 201)
})
