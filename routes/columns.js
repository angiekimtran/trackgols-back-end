const express = require("express")
const column = require("../functions/columns")

const router = express.Router()

// get a column
router.get('/<id>', column.getColumn)

// update a column
router.put('/<id>', column.updateColumn)

// delete a column
router.delete('/<id>', column.deleteColumn)

// get all card from a column
router.get('/<id>/cards', column.getCards)

// create a card
router.post('/<id>/cards', column.postCards)

module.exports = router