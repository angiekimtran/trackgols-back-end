const { ObjectId } = require('mongodb')
const Joi = require('joi')
const { connect } = require('../mongo')
const { columnsCollection, columnsSchema } = require('./columns')
const { isEmpty } = require('lodash')

const boardsCollection = 'boards'
const boardsSchema = Joi.object({
    _id: Joi.object(),
    title: Joi.string().trim().min(1).max(50).required(),
    columns: Joi.array().default([]),
})

const getBoard = async (req, res) => {
    const db = await connect()
    const board = await db
        .collection(boardsCollection)
        .aggregate([
            { $match: { _id: new ObjectId(req.params.id) } },
            { $project: { columns: 0 } },
        ])
        .toArray()
    if (res) res.send(...board)
    return board
}

const updateBoard = async (req, res) => {
    const db = await connect()
    const board = await db
        .collection(boardsCollection)
        .findOne({ _id: new ObjectId(req.params.id) })
    const update = { ...board, ...req.body }
    const { error, value } = boardsSchema.validate(update, {
        abortEarly: false,
    })
    if (error) return res.send({ Message: error.details.map((e) => e.message) })
    await db
        .collection(boardsCollection)
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: value })
    res.send({ Message: `Updated board with id ${req.params.id}` })
}

const getBoardColumns = async (req, res) => {
    const db = await connect()
    const board = await db
        .collection(boardsCollection)
        .findOne({ _id: new ObjectId(req.params.id) })
    const columns = await db
        .collection(columnsCollection)
        .find({ _id: { $in: board.columns.map((c) => c._id) } })
        .toArray()
    const sorted = board.columns.map((b) =>
        columns.find((c) => c._id.toString() === b._id.toString())
    )
    if (res) res.send(sorted)
    return sorted
}

const updateBoardColumns = async (db, boardID, columnID) => {
    const board = await db
        .collection(boardsCollection)
        .findOne({ _id: boardID })
    const columns = board.columns
    board.columns = isEmpty(columns)
        ? [{ _id: columnID }]
        : [...columns, { _id: columnID }]
    await db
        .collection(boardsCollection)
        .updateOne({ _id: boardID }, { $set: board })
}

const createColumn = async (req, res) => {
    const db = await connect()
    const boardID = new ObjectId(req.params.id)
    const body = req.body
    const { error, value } = columnsSchema.validate(body, { abortEarly: false })
    if (error) return res.send({ Message: error.details.map((e) => e.message) })
    const column = await db.collection(columnsCollection).insertOne(value)
    await updateBoardColumns(db, boardID, column.insertedId)
    res.send({ Message: `Created column for board with id ${req.params.id}` })
}

module.exports = {
    boardsCollection,
    boardsSchema,
    getBoard,
    updateBoard,
    getBoardColumns,
    createColumn,
}
