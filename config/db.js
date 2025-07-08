import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI

export const server = () => {
    mongoose.connect(MONGO_URI).then(() => {
        console.log('Server Connected')
    }).catch((e) => {
        console.log('Something error happened', e)
    })
}