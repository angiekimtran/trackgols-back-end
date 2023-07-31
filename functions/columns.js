
const columnsCollection = "columns"

const getColumn = (req, res) => { }

const updateColumn = (req, res) => {
    res.send({ "message": "Column successfully updated" })
}

const deleteColumn = (req, res) => {
    res.send({ "message": "Column successfully deleted" })
}

const getCards = (req, res) => { }

const postCards = (req, res) => {
    res.send({ "message": "Card successfully created" })
}

module.exports = {
    columnsCollection,
    getColumn,
    updateColumn,
    deleteColumn,
    getCards,
    postCards
}