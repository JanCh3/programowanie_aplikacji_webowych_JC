const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Strona Główna</title>
    </head>
    <body>
      <h1>Strona główna</h1>
      <p>Dowolny tekst na stronie głównej.</p>
    </body>
    </html>
  `)
})

app.get('/kontakt', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kontakt</title>
    </head>
    <body>
      <h1>Kontakt</h1>
      <form id="contactForm" action="/kontakt" method="post">
        <label for="name">Imię:</label>
        <input type="text" id="name" name="name" required><br>

        <label for="email">Adres e-mail:</label>
        <input type="email" id="email" name="email" required><br>

        <label for="subject">Temat:</label>
        <select id="subject" name="subject" required>
          <option value="temat1">Temat 1</option>
          <option value="temat2">Temat 2</option>
        </select><br>

        <label for="message">Treść wiadomości:</label>
        <textarea id="message" name="message" rows="4" cols="50" required></textarea><br>

        <input type="submit" value="Wyślij">
      </form>

      <script>
        document.addEventListener('DOMContentLoaded', function () {
          const form = document.getElementById('contactForm');
          form.addEventListener('submit', function (event) {
            // W tym miejscu możesz dodać dodatkową logikę obsługi formularza przed zablokowaniem
            // np. wysyłanie danych za pomocą AJAX
          });
        });
      </script>
    </body>
    </html>
  `)
})

app.post('/kontakt', (req, res) => {
  console.log('Dane z formularza:', req.body)
})

const apiRouter = express.Router()

apiRouter.get('/', (req, res) => {
  const apiLinks = [
    { endpoint: '/api/students', description: 'Zwraca listę studentów' },
    { endpoint: '/api/students/:id', description: 'Zwraca studenta z określonym identyfikatorem lub 404' },
    { endpoint: '/api/subjects', description: 'Zwraca listę przedmiotów szkolnych' },
    { endpoint: '/api/subjects/:id', description: 'Zwraca przedmiot z określonym identyfikatorem lub 404' },
  ];
  res.json(apiLinks)
})

apiRouter.get('/students', (req, res) => {
  const students = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `Student-${index + 1}`,
    surname: `Surname-${index + 1}`,
    email: `student${index + 1}@example.com`,
  }))
  res.json(students)
})

apiRouter.get('/students/:id', (req, res) => {
  const studentId = req.params.id
  const student = {
    id: studentId,
    name: `Student-${studentId}`,
    surname: `Surname-${studentId}`,
    email: `student${studentId}@example.com`,
  };
  res.json(student)
})

apiRouter.get('/subjects', (req, res) => {
  const subjects = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `Subject-${index + 1}`,
    hoursAWeek: Math.floor(Math.random() * 5) + 1,
  }));
  res.json(subjects)
})

apiRouter.get('/subjects/:id', (req, res) => {
  const subjectId = req.params.id
  const subject = {
    id: subjectId,
    name: `Subject-${subjectId}`,
    hoursAWeek: Math.floor(Math.random() * 5) + 1,
  }
  res.json(subject)
})

app.use('/api', apiRouter)
app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`)
})