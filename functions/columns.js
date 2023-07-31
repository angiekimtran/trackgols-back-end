const { ObjectId } = require('mongodb')
const Joi = require('joi')
const { isEmpty } = require("lodash")
const { connect } = require("../mongo")
const { cardsCollection, cardsSchema } = require("./cards")

const columnsCollection = "columns"
const columnsSchema = Joi.object({
    _id: Joi.object(),
    boardID: Joi.object().required(),
    title: Joi.string().min(1).max(50).required()
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

const getCards = async (req, res) => {
    const db = await connect()
    const cards = await db.collection(cardsCollection).find({ columnID: new ObjectId(req.params.id) }).sort({ position: 1 }).toArray()
    if (res) res.send(cards)
    return cards
}

const createCard = async (req, res) => {
    const db = await connect()
    const card = await db.collection(cardsCollection).findOne({ columnID: new ObjectId(req.params.id), position: req.body.position })
    if (!isEmpty(card)) return res.send({ "Message": "Position already exists" })
    const { error, value } = cardsSchema.validate({ ...req.body, columnID: new ObjectId(req.params.id) }, { abortEarly: false })
    if (error) return res.send({ "Message": error.details.map((e) => e.message) })
    await db.collection(cardsCollection).insertOne(value)
    res.send({ "Message": `Created card for column with id ${req.params.id}` })
}

module.exports = {
    columnsCollection,
    columnsSchema,
    getColumn,
    updateColumn,
    deleteColumn,
    getCards,
    createCard
}