import { connect } from "amqplib";

let channel = null;

export async function getChannel() {
    try {
        if (channel) {
            return channel;
        }
        const connection = await connect('amqp://localhost');
        channel = await connection.createChannel();

        const ok = await channel.assertQueue("auth-queue");

        if (ok) {
            console.log("Connected to RabbitMQ");
            return channel;
        }
        return channel;
    } catch (error) {
        console.error("Error connecting to RabbitMQ", error);
        throw error;
    }
}