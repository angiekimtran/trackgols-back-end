// update a card
app.put('/cards/<id>', (req, res) => { })

// delete a card
app.delete('/cards/<id>', (req, res) => {
    res.send({ "message": "Card successfully deleted" })
})