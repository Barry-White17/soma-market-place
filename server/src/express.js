import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import shopRoutes from './routes/shop.routes.js'
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import auctionRoutes from './routes/auction.routes.js'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import bidding from './controllers/bidding.controller.js'

// modules for server side rendering

//end

//comment out before building for production

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

//comment out before building for production
app.use((req, res, next) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin')
    next()
})
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
)
// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    }),
)
// enable CORS - Cross Origin Resource Sharing

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', shopRoutes)
app.use('/', productRoutes)
app.use('/', orderRoutes)
app.use('/', auctionRoutes)

/*
app.get('*', (req, res) => {
    const sheets = new ServerStyleSheets()
    const context = {}
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
                <ThemeProvider theme={theme}>
                    <MainRouter />
                </ThemeProvider>
            </StaticRouter>,
        ),
    )
    if (context.url) {
        return res.redirect(303, context.url)
    }
    const css = sheets.toString()
    res.status(200).send(
        Template({
            markup: markup,
            css: css,
        }),
    )
})
*/

// Catch unauthorised errors
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: err.name + ': ' + err.message })
    } else if (err) {
        res.status(400).json({ error: err.name + ': ' + err.message })
        console.log(err)
    }
})
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    },
})
bidding(io)
export { server as app }
