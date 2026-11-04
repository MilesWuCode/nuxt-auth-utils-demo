export default defineEventHandler(async (event) => {
  const { user, loggedInAt, secure, tokenExpiredAt } =
    await requireUserSession(event)

  const session = await setUserSession(event, {
    user: { ...user, fetched_at: Date.now() },
    loggedInAt,
    secure,
    tokenExpiredAt,
  })

  setResponseStatus(event, 200)

  return session.user
})
