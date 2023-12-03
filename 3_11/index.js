const express = require('express')
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const uri = 'mongodb+srv://janchodorski:password@cluster0.mongodb.net/Cluster0?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(bodyParser.json())

async function connectToDatabase() {
  try {
    await client.connect()
    console.log('Connected to the database')
    return client.db('Cluster0')
  } catch (err) {
    console.error('Error connecting to the database', err)
  }
}

async function setupDatabase() {
  const db = await connectToDatabase()
  await db.createCollection('contact')
  console.log('Collection "contact" created')
}

async function saveContactMessage(message) {
  const db = await connectToDatabase()
  const contactCollection = db.collection('contact')
  await contactCollection.insertOne(message)
  console.log('Message saved to MongoDB')
}

app.post('/api/contact', async (req, res) => {
  const message = {
    name: req.body.name || null,
    email: req.body.email,
    message: req.body.message
  };

  try {
    await saveContactMessage(message);
    res.json({ success: true, message: 'Message saved successfully' });
  } catch (err) {
    console.error('Error saving message to MongoDB', err)
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
})

app.get('/api/messages', async (req, res) => {
  try {
    const db = await connectToDatabase()
    const contactCollection = db.collection('contact')
    const messages = await contactCollection.find().toArray()
    res.json(messages)
  } catch (err) {
    console.error('Error fetching messages from MongoDB', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

(async () => {
  await setupDatabase()
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
})()
