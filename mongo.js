const { MongoClient } = require("mongodb")

const CONNECTION_STRING = process.env.CONNECTION_STRING
const DB_NAME = process.env.DB_NAME

const connect = async () => {
    try {
        const client = await MongoClient.connect(CONNECTION_STRING)
        const db = await client.db(DB_NAME)
        return db
    }
    catch {
        console.log("Connection to database failed!")
    }
}

module.exports = {
    connect
}