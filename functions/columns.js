const { ObjectId } = require('mongodb')
const Joi = require('joi')
const { isEmpty } = require('lodash')
const { connect } = require('../mongo')
const { cardsCollection, cardsSchema } = require('./cards')

const columnsCollection = 'columns'
const boardsCollection = 'boards'

const columnsSchema = Joi.object({
    _id: Joi.object(),
    title: Joi.string().min(1).max(50).required(),
    cards: Joi.array().default([]),
})

const getColumn = async (req, res) => {
    const db = await connect()
    const column = await db
        .collection(columnsCollection)
        .aggregate([
            { $match: { _id: new ObjectId(req.params.id) } },
            { $project: { cards: 0 } },
        ])
        .toArray()
    if (res) res.send(...column)
    return column
}

const updateColumn = async (req, res) => {
    const db = await connect()
    const column = await db
        .collection(columnsCollection)
        .findOne({ _id: new ObjectId(req.params.id) })
    if (req.body.cards) {
        req.body.cards = req.body.cards.map((card) => ({
            _id: new ObjectId(card._id),
        }))
    }
    const update = { ...column, ...req.body }
    const { error, value } = columnsSchema.validate(update, {
        abortEarly: false,
    })
    if (error) return res.send({ Message: error.details.map((e) => e.message) })
    await db
        .collection(columnsCollection)
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: value })
    res.send({
        Message: `Successfully updated column with id ${req.params.id}`,
    })
}

const deleteColumn = async (req, res) => {
    const db = await connect()
    const _id = new ObjectId(req.params.id)
    const column = await db.collection(columnsCollection).findOne({ _id })
    const board = await db
        .collection(boardsCollection)
        .findOne({ columns: { _id } })
    board.columns = board.columns.filter(
        (col) => col._id.toString() !== column._id.toString()
    )

    await db
        .collection(cardsCollection)
        .deleteMany({ _id: { $in: column.cards.map((card) => card._id) } })
    await db
        .collection(boardsCollection)
        .updateOne({ _id: board._id }, { $set: board })
    await db.collection(columnsCollection).deleteOne({ _id })

    res.send({
        Message: `Column with id ${req.params.id} successfully deleted`,
    })
}

const getColumnCards = async (req, res) => {
    const db = await connect()
    const column = await db
        .collection(columnsCollection)
        .findOne({ _id: new ObjectId(req.params.id) })
    const cards = await db
        .collection(cardsCollection)
        .find({ _id: { $in: column.cards.map((card) => card._id) } })
        .toArray()
    const sorted = column.cards.map((colCards) =>
        cards.find((card) => card._id.toString() === colCards._id.toString())
    )
    if (res) res.send(sorted)
    return sorted
}

const updateColumnCards = async (db, columnID, cardID) => {
    const column = await db
        .collection(columnsCollection)
        .findOne({ _id: columnID })
    const cards = column.cards
    column.cards = isEmpty(cards)
        ? [{ _id: cardID }]
        : [...cards, { _id: cardID }]
    await db
        .collection(columnsCollection)
        .updateOne({ _id: columnID }, { $set: column })
}

const createCard = async (req, res) => {
    const db = await connect()
    const columnID = new ObjectId(req.params.id)
    const body = req.body
    const { error, value } = cardsSchema.validate(body, { abortEarly: false })
    if (error) return res.send({ Message: error.details.map((e) => e.message) })
    const card = await db.collection(cardsCollection).insertOne(value)
    await updateColumnCards(db, columnID, card.insertedId)
    res.send({ Message: `Created card for column with id ${req.params.id}` })
}

module.exports = {
    columnsCollection,
    columnsSchema,
    getColumn,
    updateColumn,
    deleteColumn,
    getColumnCards,
    createCard,
}
