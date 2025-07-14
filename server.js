import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { server } from './config/db.js'
import authRouter from './router/authRouter.js'
import websiteRouter from './router/websiteRouter.js'
import userview_router from './router/user_view_router/userview_routes.js'
import webContent from './router/webContent.js'
import { dynamicCorsMiddleware } from './config/db.js'

dotenv.config()
const PORT = process.env.PORT

const app = express()
app.use(cors(dynamicCorsMiddleware))

app.use(express.json())

//routes
app.use('/admin', authRouter)
app.use('/', websiteRouter)
app.use('/content', webContent)

//user_routes
app.use('/public', userview_router)

//server
server()

app.listen(PORT, '0.0.0.0', () => {
    console.log(`App is running on port - http://localhost:${PORT}`)
})