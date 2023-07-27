const express = require('express')
const app = express()

const boardsRoute = require('./routes/boards_routes')
const cardsRoute = require('./routes/cards_routes')
const columnsRoute = require('./routes/columns_routes')
app.use('/boards', boardsRoute)
app.use('/cards', cardsRoute)
app.use('columns', columnsRoute)