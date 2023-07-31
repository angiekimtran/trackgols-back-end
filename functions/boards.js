const { ObjectId } = require('mongodb')
const Joi = require('joi')
const { connect } = require("../mongo")
const { columnsCollection, columnsSchema } = require("./columns")

const boardsCollection = "boards"
const boardsSchema = Joi.object({
    _id: Joi.object(),
    title: Joi.string().min(1).max(50).required()
})

const getBoard = async (req, res) => {
    const db = await connect()
    const board = await db.collection(boardsCollection).findOne({ _id: new ObjectId(req.params.id) })
    if (res) res.send(board)
    return board
}

const updateBoard = async (req, res) => {
    const db = await connect()
    const board = await getBoard(req)
    const update = { ...board, ...req.body }
    const { error, value } = boardsSchema.validate(update, { abortEarly: false })
    if (error) return res.send({ "Message": error.details.map((e) => e.message) })
    await db.collection(boardsCollection).updateOne({ _id: new ObjectId(req.params.id) }, { $set: value })
    res.send({ "Message": `Updated board with id ${req.params.id}` })
}

const getColumns = async (req, res) => {
    const db = await connect()
    const columns = await db.collection(columnsCollection).find({ boardID: new ObjectId(req.params.id) }).toArray()
    if (res) res.send(columns)
    return columns
}

const createColumn = async (req, res) => {
    const db = await connect()
    const { error, value } = columnsSchema.validate({ ...req.body, boardID: new ObjectId(req.params.id) }, { abortEarly: false })
    if (error) return res.send({ "Message": error.details.map((e) => e.message) })
    await db.collection(columnsCollection).insertOne(value)
    res.send({ "Message": `Created column for board with id ${req.params.id}` })
}

module.exports = {
    boardsCollection,
    boardsSchema,
    getBoard,
    updateBoard,
    getColumns,
    createColumn
}