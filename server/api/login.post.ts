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
      status: 401,
      message: 'Unauthorized',
    })
  }

  // ! DEMO 假資料
  const user = {
    id: '1',
    name: 'miles',
    email: email,
    fetched_at: Date.now(),
  }

  const { secure, tokenExpiredAt } = await createTokens(user.id)

  await setUserSession(event, {
    user: user,
    loggedInAt: Date.now(),
    secure: secure,
    tokenExpiredAt: tokenExpiredAt,
  })

  setResponseStatus(event, 201)
})
