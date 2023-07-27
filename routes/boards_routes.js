// get a board
app.get('/boards/<id>', (req, res) => { })

// update a board
app.put('/boards/<id>', (req, res) => { })

// get all columns
app.get('/boards/<id>/columns', (req, res) => { })

// create a column
app.post('/boards/<id>/columns', (req, res) => {
    res.send({ "message": "Board successfully created" })
})

// STRETCH GOALS BELOW //

// post a board
// app.post('/boards/<id>', (req, res) => { })

// delete a board
// app.delete('/boards/<id>', (req, res) => { })

// get user info
// app.get('/users/<id>', (req, res) => { })

// update user info
// app.put('/users/<id>', (req, res) => { })

// get a user's boards
// app.get('/users/<id>/boards', (req, res) => { })