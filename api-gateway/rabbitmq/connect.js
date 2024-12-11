import amqp from "amqplib";

export async function connectWithRabbitMQ() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
         const ok = await channel.assertQueue("auth-queue");
        if (ok) {
            console.log("Connected to RabbitMQ");
            return channel;
        }
    } catch (error) {
        console.error("Error connecting to RabbitMQ", error);
    }
}
