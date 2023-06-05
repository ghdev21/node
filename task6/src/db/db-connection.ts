import mongoose from "mongoose";
//export const mongodbUrl = "mongodb+srv://Andrii:Da8OVCJGJczvXxKP@cluster0.2buqzxf.mongodb.net/?retryWrites=true&w=majority";
export const mongodbUrl = "mongodb://localhost:27017/ex-cart";
export const connectToDB = async (mongodbUrl: string) => {
    try {
        await mongoose.connect(mongodbUrl);
        console.log('connected to the db')
    } catch (err){
        console.error('Error connecting to MongoDB:', err);
    }
}
