const express = require('express')
const Sequelize = require('sequelize')
const mongoose = require('mongoose')

const app = express()
const port = 3000

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
})

const User = sequelize.define('User', {
  name: Sequelize.STRING,
})

const Post = sequelize.define('Post', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT,
})

const Comment = sequelize.define('Comment', {
  text: Sequelize.TEXT,
})

User.hasOne(Post)
Post.belongsTo(User)
User.hasMany(Comment)
Comment.belongsTo(User)
Post.hasMany(Comment)
Comment.belongsTo(Post)

sequelize.sync({ force: true }).then(() => {
  console.log('Tables created')
})

mongoose.connect('mongodb://localhost:27017/nosql_db', { useNewUrlParser: true, useUnifiedTopology: true })

const NoSqlDataSchema = new mongoose.Schema({
  name: String,
  data: mongoose.Schema.Types.Mixed,
})

const NoSqlData = mongoose.model('NoSqlData', NoSqlDataSchema)

app.use(express.json())

app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/api/nosql', async (req, res) => {
  try {
    const { name, data } = req.body
    const savedData = await NoSqlData.create({ name, data })
    res.json(savedData)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
