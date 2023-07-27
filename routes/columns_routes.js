// get a column
app.get('/columns/<id>', (req, res) => { })

// update a column
app.put('/columns/<id>', (req, res) => { })

// delete a column
app.delete('/columns/<id>', (req, res) => {
    res.send({ "message": "Column successfully deleted" })
})

// get all card from a column
app.get('/columns/<id>/cards', (req, res) => { })

// create a card
app.post('/columns/<id>/cards', (req, res) => {
    res.send({ "message": "Card successfully created" })
})
