const express = require("express")
const card = require("../functions/cards")

const router = express.Router()

// update a card
router.put('/<id>', card.updateCard)

// delete a card
router.delete('/<id>', card.deleteCard)

module.exports = router