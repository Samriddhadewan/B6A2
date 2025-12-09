import { Request, Response } from "express";
import { usersService } from "./users.service";



const getUser = async (req: Request, res: Response) => {
    try {
        const result = await usersService.getUser();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const updateSingleUser = async (req: Request, res: Response) => {
    try {
        const result = await usersService.updateSingleUser(req.params.id as string, req.body);

        res.status(200).json({
            success: true,
            message: "Users updated successfully",
            data: result.rows
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const deleteSingleUser = async (req: Request, res: Response) => {
    try {
        const result = await usersService.deleteSingleUser(req.params.id as string);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Users deleted successfully",
                data: result.rows
            });
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

export const usersController = {
    getUser,
    updateSingleUser,
    deleteSingleUser
}