const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const controllers = require('./controllers/index')

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

for (const controller of controllers.map(Controller => new Controller())) {
    app.use('/api', controller.router)
}

app.listen(port, () => console.log(`Server running on port ${port}`))
