import config from './../config.js'
import { app } from './express.js'
import mongoose from 'mongoose'
import bidding from './controllers/bidding.controller.js'

// Connection URL
mongoose.Promise = global.Promise

mongoose.connect(config.mongoUri)

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

const server = app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.info('Server started on port %s.', config.port)
})
