import { JsonWebTokenError } from "jsonwebtoken";
import { pool } from "../../config/db"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import config from "../../config";

const registerUser = async (name: string, email: string, password: string, phone: string, role: string,) => {

    const existing = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (existing.rows.length > 0) {
        return null
    }

    const hashedPass = await bcrypt.hash(password as string, 10)
    const result = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`, [name, email, hashedPass, phone, role]);

    const user = result.rows[0];

    const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, config.jwtSecret as string, {
        expiresIn: "7d",
    });

    return { token, user };
};

const loginUser = async (email: string, password: string) => {

    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (result.rows.length === 0) {
        return null
    }

    const user = result.rows[0]

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return false;
    }

    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, config.jwtSecret as string, {
        expiresIn: "7d",
    });

    return { token, user };
};

export const authService = {
    loginUser,
    registerUser
}