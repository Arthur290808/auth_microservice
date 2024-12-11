import { checkUserData, insertUser } from "./database/index.js";
import { getChannel } from "./rabbitmq/connect.js";
import { generateJwtToken } from "./jwt.js";

const channel = await getChannel();

channel.consume("auth-queue", async (msg) => {
    const msgData = JSON.parse(msg.content.toString());
    console.log("Received message: %s", msgData);
    const success = "Success";
    const failure = "Failure";
    try {
        if (msgData.type === "register") {
            insertUser(msgData);
            console.log("Registered1");
            channel.sendToQueue(msg.properties.replyTo, Buffer.from(success.toString()), {
                correlationId: msg.properties.correlationId
            });
            console.log("Registered2");
            channel.ack(msg);
            
        } else if (msgData.type === "login") {
            // login
            console.log("Login");
            const status = await checkUserData(msgData);
            console.log("Status:", status);

            if (status !== false) {
                const jwtData = {
                    username: msgData.username,
                    id: status
                };
                const token = await generateJwtToken(jwtData);
                console.log("Token generated");
                console.log("Token:", token);
                const responseData = {
                    token: token,
                    status: success
                }
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(token.toString()), {
                    correlationId: msg.properties.correlationId
                });
            } else {
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(failure.toString()), {
                    correlationId: msg.properties.correlationId
                });
            }

            channel.ack(msg);
        } else {
            console.error("Unknown type", msgData.type);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
