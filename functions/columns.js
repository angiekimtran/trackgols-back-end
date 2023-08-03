const { ObjectId } = require('mongodb')
const Joi = require('joi')
const { isEmpty } = require("lodash")
const { connect } = require("../mongo")
const { cardsCollection, cardsSchema } = require("./cards")

const columnsCollection = "columns"
const columnsSchema = Joi.object({
    _id: Joi.object(),
    title: Joi.string().min(1).max(50).required(),
    cards: Joi.array().default([])
})
const getColumn = async (req, res) => {
    const db = await connect()
    const column = await db.collection(columnsCollection).findOne({ _id: new ObjectId(req.params.id) })
    if (res) res.send(column)
    return column
}

const updateColumn = async (req, res) => {
    const db = await connect()
    const column = await getColumn(req)
    const update = { ...column, ...req.body }
    const { error, value } = columnsSchema.validate(update, { abortEarly: false })
    if (error) return res.send({ "Message": error.details.map((e) => e.message) })
    await db.collection(columnsCollection).updateOne({ _id: new ObjectId(req.params.id) }, { $set: value })
    res.send({ "Message": `Successfully updated column with id ${req.params.id}` })
}

const deleteColumn = async (req, res) => {
    const db = await connect()
    await db.collection(columnsCollection).deleteOne({ _id: new ObjectId(req.params.id) })
    res.send({ "Message": `Column with id ${req.params.id} successfully deleted` })
}

const getColumnCards = async (req, res) => {
    const db = await connect()
    const column = await db.collection(columnsCollection).findOne({ _id: new ObjectId(req.params.id) })
    if (res) res.send(column.cards)
    return column.cards
}

const updateColumnCards = async (db, columnID, cardID, position) => {
    const column = await db.collection(columnsCollection).findOne({ _id: columnID })
    const cards = column.cards
    column.cards = isEmpty(cards) ?
        [{ _id: cardID }] :
        [...cards.slice(0, position - 1), { _id: cardID }, ...cards.slice(position - 1)]
    await db.collection(columnsCollection).updateOne({ _id: columnID }, { $set: column })
}

const createCard = async (req, res) => {
    const db = await connect()
    const columnID = new ObjectId(req.params.id)
    const { position, ...body } = req.body
    const { error, value } = cardsSchema.validate(body, { abortEarly: false })
    if (error) return res.send({ "Message": error.details.map((e) => e.message) })
    const card = await db.collection(cardsCollection).insertOne(value)
    await updateColumnCards(db, columnID, card.insertedId, position)
    res.send({ "Message": `Created card for column with id ${req.params.id}` })
}

module.exports = {
    columnsCollection,
    columnsSchema,
    getColumn,
    updateColumn,
    deleteColumn,
    getColumnCards,
    createCard
}