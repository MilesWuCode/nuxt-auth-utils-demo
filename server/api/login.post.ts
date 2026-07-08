import { getExpiredAt } from '#shared/utils/auth'
import { SignJWT } from 'jose'
import * as z from 'zod'

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(
    event,
    z.object({
      email: z.email(),
      password: z.string().min(8),
    }).parse,
  )

  if (email !== 'user@email.com' || password !== 'password') {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  // ! DEMO 假資料
  const user = {
    id: '1',
    name: 'miles',
    email: email,
    fetched_at: Date.now(),
  }

  const { jwtSecret } = useRuntimeConfig()

  const secret = new TextEncoder().encode(jwtSecret)

  // ! DEMO accessToken故意設10秒就過期，方便測試refresh流程；正式環境請依需求調整(例如15分鐘)
  const accessToken = await new SignJWT({ sub: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10s')
    .sign(secret)

  const refreshToken = await new SignJWT({ sub: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(secret)

  await setUserSession(event, {
    user: user,
    token: {
      accessToken: accessToken,
      accessTokenExpiredAt: getExpiredAt(10),
      refreshToken: refreshToken,
      refreshTokenExpiredAt: getExpiredAt(86400),
    },
    loggedInAt: Date.now(),
  })

  setResponseStatus(event, 201)
})
