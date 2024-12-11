import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://aboelter:ypBSt5gnCRwp96Cb@cluster0.p3lcxyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const client = new MongoClient(uri);
async function connectWithMongoDB() {
    try {
        await client.connect();
        await client.db("user").command({ ping: 1 });
        console.log("Pinged your Deployment and Connected to MongoDB");
        return client;
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}

export { client, connectWithMongoDB };