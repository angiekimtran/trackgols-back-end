const { ObjectId } = require('mongodb')
const Joi = require('joi')
const { connect } = require('../mongo')

const cardsCollection = 'cards'
const columnsCollection = 'columns'

const cardsSchema = Joi.object({
    _id: Joi.object(),
    message: Joi.string().min(1).max(50).required(),
})

const getCard = async (req, res) => {
    const db = await connect()
    const card = await db
        .collection(cardsCollection)
        .findOne({ _id: new ObjectId(req.params.id) })
    if (res) res.send(card)
    return card
}

const updateCard = async (req, res) => {
    const db = await connect()
    const card = await db
        .collection(cardsCollection)
        .findOne({ _id: new ObjectId(req.params.id) })
    const update = { ...card, ...req.body }
    const { error, value } = cardsSchema.validate(update, { abortEarly: false })
    if (error) return res.send({ Message: error.details.map((e) => e.message) })
    await db
        .collection(cardsCollection)
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: value })
    res.send({ Message: `Successfully updated card with id ${req.params.id}` })
}

const deleteCard = async (req, res) => {
    const db = await connect()
    const _id = new ObjectId(req.params.id)
    const card = await db.collection(cardsCollection).findOne({ _id })
    const column = await db
        .collection(columnsCollection)
        .findOne({ cards: { _id } })
    column.cards = column.cards.filter(
        (crd) => crd._id.toString() !== card._id.toString()
    )

    await db
        .collection(columnsCollection)
        .updateOne({ _id: column._id }, { $set: column })
    await db
        .collection(cardsCollection)
        .deleteOne({ _id: new ObjectId(req.params.id) })
    res.send({ Message: `Card with id ${req.params.id} successfully deleted` })
}

module.exports = {
    cardsCollection,
    cardsSchema,
    getCard,
    updateCard,
    deleteCard,
}
