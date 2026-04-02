import { faker } from '@faker-js/faker'
import { isExpired } from '#shared/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (
    // 沒有session
    !session
  ) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  if (
    // accessToken過期
    isExpired(session.token?.accessTokenExpiredAt)
  ) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  await setUserSession(event, {
    user: { name: faker.person.fullName() },
  })

  return setResponseStatus(event, 200)
})
