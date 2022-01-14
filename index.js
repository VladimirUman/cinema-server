const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const routes = require('./routes/route-list')

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use('/api', routes)

app.listen(port, () => console.log(`Server running on port ${port}`))
