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
    .setCookie(`same-site-none`, `yes`, { sameSite: `none`, secure: true })
    .send(request.cookies)
})

server.get(`/page`, async (_, reply) => {
  const testUrl = `https://seob-test-cookies.herokuapp.com/`

  return reply.header(`Content-Type`, `text/html`).send(`
    <a href="${testUrl}">Link Click</a>
    <form method="get" action="${testUrl}">
      <button type="submit">Form Submit</button>
    </form>
    <script>
      function pushLocation() {
        window.location.href = '${testUrl}';
      }
    </script>
    <button onclick="pushLocation()">Location href</button>
  `)
})

const start = async () => {
  try {
    await server.listen(process.env.PORT ?? 3000, `0.0.0.0`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
