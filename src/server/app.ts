import { GraphQLServer, PubSub } from 'graphql-yoga'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'

import { resolvers } from '../resolvers/resolvers'

require('dotenv').config()

const pubsub = new PubSub()

const getUser = (token: string) => {
    try {
        if (token) {
            return jwt.verify(token, process.env.MONGODB_SECRET || '')
        }
    } catch (err) {
        return null
    }
}

const server = new GraphQLServer({
    typeDefs: fs.readFileSync(
        path.join('src/schema', 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ request }) => {
        const tokenWithBearer = request?.headers.authorization || ''
        const token = tokenWithBearer.split(' ')[1]
        const user = getUser(token)

        return {
            user,
            pubsub
        }
    }
})

mongoose.connect(process.env.MONGODB_TOKEN || '')

const dbConnection = mongoose.connection

dbConnection.on('error', err => console.log(err))
dbConnection.once('open', () => console.log('DB Connected!'))

server.start(({ port }) => console.log('http://localhost:' + port))