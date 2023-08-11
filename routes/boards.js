const express = require('express')
const board = require('../functions/boards')

const router = express.Router()

// get a board
router.get('/:id', board.getBoard)

// update a board
router.put('/:id', board.updateBoard)

// get all columns
router.get('/:id/columns', board.getBoardColumns)

// create a column
router.post('/:id/columns', board.createColumn)

module.exports = router
