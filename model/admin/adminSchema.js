import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    panelData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminPanel',
        required: true,
    }
}, { timestamps: true })


export const Admin = mongoose.model('Admin', adminSchema)