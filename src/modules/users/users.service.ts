import { pool } from "../../config/db";
import bcrypt from 'bcryptjs'


const getUser = async () => {
    const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
    return result;
};

const updateSingleUser = async (id: string, payload: Record<string, unknown>) => {

    const { name, role, email, phone } = payload;
    const result = await pool.query(`UPDATE users SET name=$1, role=$2, email=$3, phone=$4 WHERE id=$5 RETURNING id, name, email, phone, role`, [name, role, email, phone, id]);
    return result;
};

const deleteSingleUser = async(id: string) => {

    const bookingResult = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`, [id]);
    if(bookingResult.rows.length > 0) {
        throw new Error("Cannot delete user with active bookings");
    }

    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
    return result;
};

export const usersService = {
    getUser,
    updateSingleUser,
    deleteSingleUser
};

