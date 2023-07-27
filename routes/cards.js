const express = require("express")
const router = express.Router()

// update a card
router.put('/<id>', updateCard)

// delete a card
router.delete('/<id>', deleteCard)

module.exports = router