require("dotenv").config()
const express = require('express')
const { createServer } = require('http')

const boardsRoute = require('./routes/boards')
const cardsRoute = require('./routes/cards')
const columnsRoute = require('./routes/columns')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3001
const app = express()

app.use(bodyParser.json())
app.use('/boards', boardsRoute)
app.use('/cards', cardsRoute)
app.use('/columns', columnsRoute)

const httpServer = createServer(app)
httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
