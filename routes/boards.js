const express = require("express")
const board = require("../functions/boards")

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


// STRETCH GOALS BELOW //

// post a board
// router.post('/boards/<id>', (req, res) => { })

// delete a board
// router.delete('/boards/<id>', (req, res) => { })

// get user info
// router.get('/users/<id>', (req, res) => { })

// update user info
// router.put('/users/<id>', (req, res) => { })

// get a user's boards
// router.get('/users/<id>/boards', (req, res) => { })