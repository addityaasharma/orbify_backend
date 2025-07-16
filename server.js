import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { server } from './config/db.js'
import authRouter from './router/authRouter.js'
import websiteRouter from './router/websiteRouter.js'
import userview_router from './router/user_view_router/userview_routes.js'
import webContent from './router/webContent.js'
import { dynamicCorsMiddleware } from './config/db.js'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

dotenv.config()
const PORT = process.env.PORT
const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

app.use(cors(dynamicCorsMiddleware))
app.use(express.json())

app.use('/admin', authRouter)
app.use('/', websiteRouter)
app.use('/content', webContent)
app.use('/public', userview_router)

server()

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App is running on port - http://localhost:${PORT}`)
})
