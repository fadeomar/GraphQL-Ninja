const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose');
const cors = require('cors')

const app = express()

//allow corss-origin requests 
app.use(cors())

mongoose.connect('mongodb+srv://fadi:0598658674f@testgraphql-9tgr8.mongodb.net/test?retryWrites=true&w=majority')
mongoose.connection.once('open', () => {
    console.log('connection with DB')
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true,
}))

app.listen(5000, () => {
    console.log('server run at http://localhost:5000')
})