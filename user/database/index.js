import { connectWithMongoDB } from "./connect.js";
import bcrypt from 'bcrypt';

export async function insertUser(user) {
    try {
        console.log("Inserting user", user);
        const client = await connectWithMongoDB();
        console.log("Connected to MongoDB");
        const result = await client.db("user").collection("user").insertOne(user);
        console.log("Inserted user", result);
        return result;
    } catch (error) {
        console.error("Error inserting user", error);
        throw error;
    }
}

export async function checkUserData(user) {
    try {
        console.log("Checking User Data");

        // Verbinde mit MongoDB
        const client = await connectWithMongoDB();
        console.log("Connected to MongoDB");

        // Suche den Benutzer in der DB
        const result = await client.db("user").collection("user").findOne({ username: user.username });
        console.log("User found:", result);

        if (!result) {
            console.log("User not found");
            return false;
        }

        // Vergleiche die Passwörter
        console.log(user.password, result.password);

        if (user.password === result.password) {
            console.log("Password correct");
            return result._id; // Gebe die ID des Benutzers zurück
        } else { // Falls das Passwort nicht stimmt
            console.log("Password incorrect");
            return false;
        }
    } catch (error) {
        console.error("Error checking user data", error);
        throw error; // Leite den Fehler weiter
    }
}