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

  await setUserSession(event, {
    user: { name: faker.person.fullName() },
  })

  return setResponseStatus(event, 200)
})
