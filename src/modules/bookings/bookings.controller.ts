import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const booking = await bookingsService.createBooking(req.body);
        res.status(201).json({
            success: true,
            message: "Bookings created Successfully",
            data: booking
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const getBookings = async (req: Request, res: Response) => {
    try {
        const user = req.user as { id: number; role: string };
        const bookings = await bookingsService.getBookings(user);
        res.status(200).json({
            success: true,
            message: user.role === "customer" ? "Your bookings retrieved successfully" : "Bookings retrieved successfully",
            data: bookings
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};


const updateBooking = async (req: Request, res: Response) => {
    try {

        const result = await bookingsService.updateBooking(req.params.id as string, req.body);

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const bookingsController = {
    createBooking,
    getBookings,
    updateBooking
}