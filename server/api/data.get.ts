import { faker } from '@faker-js/faker'
import { isExpired } from '#shared/utils/auth'

const invalidCredentialsError = createError({
  statusCode: 401,
  message: 'Invalid credentials',
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (
    // 沒有session
    !session
  ) {
    throw invalidCredentialsError
  }

  if (
    // accessToken過期
    isExpired(session.token?.accessTokenExpiredAt)
  ) {
    throw invalidCredentialsError
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
