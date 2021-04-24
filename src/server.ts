import fastify from 'fastify'
import fastifyCookie from 'fastify-cookie'

const server = fastify({ logger: true })

server.register(fastifyCookie)

server.get(`/`, async (request, reply) => {
  return reply
    .setCookie(`normal`, `yes`)
    .setCookie(`http-only`, `yes`, { httpOnly: true })
    .setCookie(`secure`, `yes`, { secure: true })
    .setCookie(`same-site-strict (secure)`, `yes`, {
      sameSite: `strict`,
      secure: true,
    })
    .setCookie(`same-site-lax (secure)`, `yes`, {
      sameSite: `lax`,
      secure: true,
    })
    .setCookie(`same-site-none (secure)`, `yes`, {
      sameSite: `none`,
      secure: true,
    })
    .setCookie(`same-site-strict (non-secure)`, `yes`, {
      sameSite: `strict`,
    })
    .setCookie(`same-site-lax (non-secure)`, `yes`, {
      sameSite: `lax`,
    })
    .setCookie(`same-site-none (non-secure)`, `yes`, {
      sameSite: `none`,
    })
    .send(request.cookies)
})

server.get(`/redirect`, async (_, reply) => {
  return reply.redirect(302, testUrl)
})

const testUrl = `https://seob-test-cookies.herokuapp.com/`

server.get(`/page`, async (_, reply) => {
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
    <a href="/redirect"">Redirect (302)</a>
  `)
})

server.get(`/iframe`, async (_, reply) => {
  return reply.header(`Content-Type`, `text/html`).send(`
    <iframe src="/page" width="1280px" height="1024px"></iframe>
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
