export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  await setUserSession(event, {
    // @ts-ignore
    user: {
      fetched_at: Date.now(),
    },
  })

  setResponseStatus(event, 200)

  return {
    ...session?.user,
  }
})
