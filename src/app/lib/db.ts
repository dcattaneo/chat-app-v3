import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return mongoose.connection.asPromise(); // Prevent re-connection if already connected
        }

        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/merndb')
        console.log('DB is connected')


    } catch (error) {
        console.error('DB connection error:', error)
    }

}