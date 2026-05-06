import { isExpired } from '#shared/utils/auth'
import { faker } from '@faker-js/faker'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

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

  for (let i = 0; i < 3; i++) {
    data.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
    })
  }

  return data
})
