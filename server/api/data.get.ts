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
    isExpired(session.token.accessTokenExpiredAt)
  ) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  const data = []
  for (let i = 0; i < 2; i++) {
    data.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
    })
  }

  return data
})
