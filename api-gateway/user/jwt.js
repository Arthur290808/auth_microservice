import jwt from 'jsonwebtoken';

const jwt_secret = "dhjqwiejhfiqwz4qhd/9fwgif:;uhdwe";

export async function validateToken(req, res) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, jwt_secret);
        return res.status(200).json({ message: "Authorized" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Error processing request", error: error.message });
        
    }
}