import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const jwt_secret = "dhjqwiejhfiqwz4qhd/9fwgif:;uhdwe";

export async function generateJwtToken(user) {
    const payload = {
        userId: user.id,
        username: user.username,
    };

    const token = jwt.sign(payload, jwt_secret, {
        expiresIn: '1h',
    });
    return token;
}