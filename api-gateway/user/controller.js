import jwt from "jsonwebtoken";
import { connectWithRabbitMQ } from "../rabbitmq/connect.js";
import { v4 as uuidv4 } from 'uuid';

export async function sendToAuthQueueAction(request, response) {
    const { username, password, type } = request.body;
    const jwt_secret = "dhjqwiejhfiqwz4qhd/9fwgif:;uhdwe";
    try {
        const channel = await connectWithRabbitMQ();
        const message = { username, password, type };
        const correlationId = uuidv4();

        // Temporäre exklusive Queue für die Antwort erstellen
        const q = await channel.assertQueue("", { exclusive: true });

        // Antwort auf die Nachricht als Promise einpacken
        const tokenPromise = new Promise((resolve, reject) => {
            channel.consume(
                q.queue,
                (msg) => {
                    if (msg.properties.correlationId === correlationId) {
                        resolve(msg.content.toString()); // Token extrahieren
                    }
                },
                { noAck: true }
            );

            // Timeout für den Fall, dass keine Antwort kommt
            setTimeout(() => reject(new Error("Timeout waiting for response")), 5000);
        });

        // Nachricht an die Queue senden
        channel.sendToQueue("auth-queue", Buffer.from(JSON.stringify(message)), {
            correlationId: correlationId,
            replyTo: q.queue,
        });

        // Auf die Antwort warten
        const token = await tokenPromise;
        const decoded = jwt.verify(token, jwt_secret);
        console.log("Decoded:", decoded);

        // HTTP-Antwort mit dem Token zurücksenden
        response.cookie("token", token, { 
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000
        });
        response.status(200).json("Token sent");
    } catch (error) {
        console.error("Error:", error);
        response.status(500).json({ message: "Error processing request", error: error.message });
    }
}