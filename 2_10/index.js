const http = require('http')
const fs = require('fs')
const path = require('path')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET') {
    if (url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Strona Główna</title>
        </head>
        <body>
          <h1>Formularz Kontaktowy</h1>
          <form action="/kontakt" method="post">
            <label for="message">Wiadomość:</label>
            <textarea id="message" name="message" rows="4" cols="50"></textarea><br>
            <input type="submit" value="Wyślij">
          </form>
        </body>
        </html>
      `);
    } else if (url === '/dziekujemy') {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Dziękujemy za przesłanie wiadomości!')
    } else if (url === '/api') {
        const data = [
            { id: 1, name: 'Obiekt 1' },
            { id: 2, name: 'Obiekt 2' },
            { id: 3, name: 'Obiekt 3' },
        ];
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(data))
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Nie znaleziono strony' }))
    }
  } else if (method === 'POST' && url === '/kontakt') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    });

    req.on('end', () => {
      const postData = querystring.parse(body)
      const message = postData.message
      const timestamp = Date.now()
      const fileName = `message-${timestamp}.txt`
      const filePath = path.join(__dirname, 'contact', fileName)

      fs.writeFile(filePath, message, (err) => {
        if (err) {
          console.error(err)
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          res.end('Wystąpił błąd podczas zapisywania wiadomości.')
        } else {
            res.writeHead(302, { Location: '/dziekujemy' })
            res.end()
        }
      })
    })
  } else {
        res.writeHead(405, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Metoda nieobsługiwana' }))
  }
})

const port = 3000

server.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`)
})