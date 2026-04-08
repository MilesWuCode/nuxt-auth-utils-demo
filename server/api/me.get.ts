export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  await setUserSession(event, {
    // @ts-ignore
    user: {
      fetched_at: Date.now(),
    },
  })

  return setResponseStatus(event, 200)
})
