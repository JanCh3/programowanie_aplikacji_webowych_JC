const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mysql = require('mysql2')

const app = express()
const port = 3000

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: '',      
  database: 'baza', 
});

db.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err)
  } else {
    console.log('Połączenie z bazą danych ustanowione')
  }
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.post('/kontakt', (req, res) => {
  const { name, email, subject, message } = req.body

  const sql = 'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
  db.query(sql, [name, email, subject, message], (err, result) => {
    if (err) {
      console.error('Błąd zapisywania wiadomości do bazy danych:', err)
      res.status(500).send('Wystąpił błąd podczas zapisywania wiadomości.')
    } else {
      console.log('Wiadomość zapisana do bazy danych')
      res.redirect('/')
    }
  });
});

const apiRouter = express.Router();

apiRouter.get('/students', (req, res) => {
  const sql = 'SELECT * FROM students'
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Błąd pobierania danych o studentach:', err)
      res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych o studentach.' })
    } else {
      res.json(results)
    }
  })
})

apiRouter.get('/students/:id', (req, res) => {
  const studentId = req.params.id
  const sql = 'SELECT * FROM students WHERE id = ?'
  db.query(sql, [studentId], (err, results) => {
    if (err) {
      console.error('Błąd pobierania danych o studencie:', err)
      res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych o studencie.' })
    } else {
      if (results.length > 0) {
        res.json(results[0])
      } else {
        res.status(404).json({ error: 'Student o podanym identyfikatorze nie istnieje.' });
      }
    }
  })
})

apiRouter.get('/subjects', (req, res) => {
  const sql = 'SELECT * FROM subjects'
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Błąd pobierania danych o przedmiotach:', err)
      res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych o przedmiotach.' })
    } else {
      res.json(results)
    }
  })
})

apiRouter.get('/subjects/:id', (req, res) => {
  const subjectId = req.params.id
  const sql = 'SELECT * FROM subjects WHERE id = ?'
  db.query(sql, [subjectId], (err, results) => {
    if (err) {
      console.error('Błąd pobierania danych o przedmiocie:', err)
      res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych o przedmiocie.' })
    } else {
      if (results.length > 0) {
        res.json(results[0])
      } else {
        res.status(404).json({ error: 'Przedmiot o podanym identyfikatorze nie istnieje.' })
      }
    }
  })
})

app.use('/api', apiRouter)

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`)
})
