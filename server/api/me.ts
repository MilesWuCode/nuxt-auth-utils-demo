// import { getUser } from "#shared/utils/auth";

const invalidCredentialsError = createError({
  statusCode: 401,
  message: 'Invalid credentials',
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (session.token?.accessToken) {
    // const user = await getUser(session.token.accessToken)
    //   .then((data) => {
    //     return {
    //       id: data.data.id,
    //       name: data.data.nickname,
    //       email: data.data.contact_email,
    //     }
    //   })
    //   .catch(() => {
    //     throw invalidCredentialsError
    //   })

    // await setUserSession(event, {
    //   ...session,
    //   user: { ...user },
    //   loggedInAt: session.loggedInAt,
    // })

    return setResponseStatus(event, 200)
  } else {
    throw invalidCredentialsError
  }
})
