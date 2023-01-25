const elasticsearch = require('elasticsearch')
const config = require('./elasticsearch.config')

const userName = config.username
const password = config.password
const host = config.host
const port = config.port

const elasticClient = new elasticsearch.Client({
    host: `http://${userName}:${password}@${host}:${port}`
})

module.exports = elasticClient