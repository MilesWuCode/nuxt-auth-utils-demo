import { isExpired } from '#shared/utils/auth'
import { faker } from '@faker-js/faker'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  if (
    // 沒有token 或 accessToken過期
    isExpired(session.tokenExpiredAt?.accessTokenExpiredAt)
  ) {
    throw createError({
      status: 401,
      message: 'Unauthorized',
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
