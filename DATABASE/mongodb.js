import mongoose from "mongoose";
import  {DB_URI, NODE_ENV} from "../config/env.js";

if(!DB_URI){
    throw new Error('Please define the MONGODB_URI environment variable inside .env.<develoment/production>.local')
}
const connectToDatabase = async () =>{
    try{
        await mongoose.connect(DB_URI)
        console.log(`✅ connect to database in ${NODE_ENV}`)
    }catch (error) {
  console.log('❌ Error connecting to database: ', error)
        process.exit(1);
    }
}

export default connectToDatabase;