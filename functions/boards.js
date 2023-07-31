const { ObjectId } = require('mongodb')
const { connect } = require("../mongo")
const { columnsCollection } = require("./columns")


const boardsCollection = "boards"

const getBoard = async (req, res) => {
    const db = await connect()
    const board = await db.collection(collection).findOne({ _id: new ObjectId(req.params.id) })
    if (res) res.send(board)
    return board
}

const updateBoard = async (req, res) => {
    const db = await connect()
    const { _id, ...board } = await getBoard(req)
    const update = { ...board, ...req.body }
    await db.collection(collection).updateOne({ _id: new ObjectId(req.params.id) }, { $set: update })
    res.send({ "Message": `Updated board with id ${req.params.id}` })
}

const getColumns = async (req, res) => {
    const db = await connect()
    res.send({ "To Do": `Retrieve columns from board with id ${req.params.id}` })
}

const createColumn = async (req, res) => {
    const db = await connect()
    await db.collection(columnsCollection).insertOne(req.body)
    res.send({ "To Do": `Create column for board with id ${req.params.id}` })
}

module.exports = {
    getBoard,
    updateBoard,
    getColumns,
    createColumn
}