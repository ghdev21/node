import mongoose from "mongoose";

export const fallback = "mongodb+srv://Andrii:Da8OVCJGJczvXxKP@cluster0.2buqzxf.mongodb.net/?retryWrites=true&w=majority";

export const mongodbUrl = process.env.MONGODB_URI || fallback;
export const connectToDB = async (mongodbUrl: string) => {
    try {
        await mongoose.connect(mongodbUrl);
        console.log('connected to the db')
    } catch (err){
        console.error('Error connecting to MongoDB:', err);
    }
}
