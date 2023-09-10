import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const db = process.env.mongourl;
const dbConnect = async() =>{
    try{
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected");
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}
export default dbConnect;


