import mongoose from 'mongoose'

let isConnected =  false;

export const connect2DB = async() => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL) return console.log('MONGODB_URL not found!');
    if(isConnected) return console.log('Already connected to MongoDB');

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
    } catch (error) {
        console.log(error);
    }
}