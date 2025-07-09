import express from 'express'
import dotenv from 'dotenv'
import { server } from './config/db.js'
import authRouter from './router/authRouter.js'
import websiteRouter from './router/websiteRouter.js'

dotenv.config()
const PORT = process.env.PORT

const app = express()

app.use(express.json())

//routes
app.use('/admin', authRouter)
app.use('/', websiteRouter)

//server
server()

app.listen(PORT, () => {
    console.log(`App is running on port - http://localhost:${PORT}`)
})