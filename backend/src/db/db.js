import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.DB_STRING}${DB_NAME}`)
        console.log(`\n MongoDB Connected || DB_HOST : ${connectionInstance.connection.host} ${DB_NAME}`)
    }catch(error){
        console.error('MongoDB connection failed:', error);
        process.exit(1) // it is given by node so no need to import it
    }
}

export default connectDB