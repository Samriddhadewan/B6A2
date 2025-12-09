import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesService.createVehicle(req.body);

        return res.status(201).json({
            success: true,
            message: "Vehicle created Successfully",
            data: result.rows[0]
        })
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const getVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesService.getVehicle();

        if (result.rowCount === 0) {
            res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: []
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicles retrieved successfully",
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

const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesService.getSingleVehicle(req.params.id as string);

        if (result.rowCount === 0) {
            res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: []
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle retrieved successfully",
                data: result.rows[0]
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
};

const updateSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesService.updateSingleVehicle(req.params.id as string, req.body);

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result.rows
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const deleteSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesService.deleteSingleVehicle(req.params.id as string);

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const vehiclesController = {
    createVehicle,
    getVehicle,
    getSingleVehicle,
    updateSingleVehicle,
    deleteSingleVehicle
}