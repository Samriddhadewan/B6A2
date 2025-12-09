import { error } from "console";
import { pool } from "../../config/db"

const createBooking = async (payload: Record<string, unknown>) => {

    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const vehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]);
    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found")
    }

    const vehicle = vehicleResult.rows[0]

    const number_of_days = Math.ceil((new Date(rent_end_date as string).getTime() - new Date(rent_start_date as string).getTime()) / (1000 * 60 * 60 * 24) + 1);
    const total_price = number_of_days * vehicle.daily_rent_price



    const result = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, "active"]);

    const booking = result.rows[0];

    booking.vehicle = {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price
    }
    return booking;
};

const getBookings = async (user: { id: number, role: string }) => {

    let bookingResult;

    if (user.role === 'customer') {
        bookingResult = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1 ORDER BY id DESC`, [user.id]);
    } else {
        bookingResult = await pool.query(`SELECT * FROM bookings ORDER BY id DESC`);
    }

    const bookings = bookingResult.rows


    const enrichedBookings = []

    for (const booking of bookings) {
        const customerResult = await pool.query(`SELECT name, email FROM users WHERE id=$1`, [booking.customer_id]);
        const customer = customerResult.rows[0]

        const vehicleResult = await pool.query(`SELECT vehicle_name, registration_number FROM vehicles WHERE id=$1`, [booking.vehicle_id]);
        const vehicle = vehicleResult.rows[0];

        enrichedBookings.push({
            ...booking,
            customer,
            vehicle
        })


    }

    return enrichedBookings;

};

const updateBooking = async (id: string, payload: Record<string, unknown>) => {
    const { status } = payload;

    const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);

    if (bookingResult.rows.length === 0) {
        throw Error("Booking not found")
    }

    const booking = bookingResult.rows[0]

    if (status === "cancelled") {
        const updatedBooking = await pool.query(`UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`, [id]);

        return {
            message: "Booking cancelled successfully",
            data: updatedBooking.rows[0]
        }
    }

    if (status === 'returned') {
        const updateVehicle = await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);
        const updatedResult = await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *`, [id]);
        const updatedBooking = updatedResult.rows[0]

        updatedBooking.vehicle = {
            availability_status: "available"
        }

        return {
            message: "Booking marked as returned. Vehicle is now available",
            data: updatedBooking,
        };
    }

    throw new Error("Invalid status update request");
};

export const bookingsService = {
    createBooking,
    getBookings,
    updateBooking
}
