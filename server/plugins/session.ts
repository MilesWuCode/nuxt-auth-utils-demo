export default defineNitroPlugin(() => {
  sessionHooks.hook('fetch', async (_session) => {
    // console.log('server plugins session hooks fetch')
  })

  sessionHooks.hook('clear', async (_session) => {
    // console.log('server plugins session hooks clear')
  })
})
