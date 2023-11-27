export const config = {
  runtime: 'edge',
}

export default async (req) =>  {
  try {
    const code = new URLSearchParams(req.url.split('?')[1]).get('code')
    const tokenRes = await fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`, {method: 'POST'})
    const text = await tokenRes.text()
    const accessToken = new URLSearchParams(text).get('access_token')
    const redirect = `soundsetr://access_token/${accessToken}`
    return new Response(`
      <meta http-equiv="refresh" content="0; url=${redirect}">
      Redirecting...<br /><br />
      <a href="${redirect}">Click here<a/> if your browser does not automaticly redirect.
      <script>setTimeout(() => window.close(), 5000)</script>
    `, { headers: { 'content-type': 'text/html' } })
  } catch (e) {
    console.log('⛔️', e.message)
    return new Response('Error authenticating. You can close this window.', { status: 500 })
  }
}