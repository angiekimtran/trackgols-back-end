const express = require("express")
const router = express.Router()

// get a column
router.get('/<id>', getColumn)

// update a column
router.put('/<id>', updateColumn)

// delete a column
router.delete('/<id>', deleteColumn)

// get all card from a column
router.get('/<id>/cards', getCards)

// create a card
router.post('/<id>/cards', postCards)

module.exports = router