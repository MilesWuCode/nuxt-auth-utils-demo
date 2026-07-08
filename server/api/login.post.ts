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

  await setUserSession(event, {
    user: user,
    token: await createTokens(user.id),
    loggedInAt: Date.now(),
  })

  setResponseStatus(event, 201)
})
