const updateCard = (req, res) => {
    res.send({ "message": "Card successfully updated" })
}

const deleteCard = (req, res) => {
    res.send({ "message": "Card successfully deleted" })
}

module.exports = {
    updateCard,
    deleteCard
}