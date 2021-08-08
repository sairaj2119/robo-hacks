require('dotenv').config()
const express = require('express')
const app = express()
const { getAllRules, deleteAllRules, setRules, streamConnect } = require('./twitter-stream')
const cors = require('cors')
const rules = require('./rules.json')
const { writeToRules } = require('./utils')
const token = process.env.TWITTER_BEARER_TOKEN
const fs = require('fs')
const path = require('path')

app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
  })
)

app.get('/t/rules', async (req, res) => {
  const result = await getAllRules(token)
  res.json(result)
})

app.post('/t/rules', async (req, res) => {
  const { tag, value } = req.body
  if (!tag || !value || tag.trim() === '' || value.trim() === '') {
    return res.status(400).json({ error: 'Tag, and Value are required' })
  }
  writeToRules({ tag, value })
  const raw = fs.readFileSync(path.join(__dirname, 'rules.json'), 'utf-8')
  const readRules = JSON.parse(raw)
  const result = await setRules(readRules, token)
  res.json(result)
})

app.delete('/t/rules', async (req, res) => {
  const result = await getAllRules(token)
  const deleted = await deleteAllRules(result, token)
  writeToRules(null, true)
  res.json(deleted)
})

app.get('/t/stream', (req, res) => {
  const stream = streamConnect(0, token)
  if (stream.isPaused()) {
    return res.status(200).json({ msg: 'Stream is paused' })
  }
})

app.post('/t/stream', (req, res) => {
  const stream = streamConnect(0, token)
  stream.pause()
  res.json({ msg: 'Stream is paused' })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('Server listening on port ' + port)
})
