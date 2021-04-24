import fastify from 'fastify'
import fastifyCookie from 'fastify-cookie'

const server = fastify({ logger: true })

server.register(fastifyCookie)

server.get(`/`, async (request, reply) => {
  return reply
    .setCookie(`normal`, `yes`)
    .setCookie(`http-only`, `yes`, { httpOnly: true })
    .setCookie(`secure`, `yes`, { secure: true })
    .setCookie(`same-site-strict`, `yes`, { sameSite: `strict` })
    .setCookie(`same-site-lax`, `yes`, { sameSite: `lax` })
    .setCookie(`same-site-none`, `yes`, { sameSite: `none` })
    .send(request.cookies)
})

const start = async () => {
  try {
    await server.listen(process.env.port ?? 3000)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
