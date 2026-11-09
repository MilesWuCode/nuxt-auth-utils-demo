export default defineEventHandler(async (event) => {
  console.log('clear access token')

  setResponseStatus(event, 204)
})
