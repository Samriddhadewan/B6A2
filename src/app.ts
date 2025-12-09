import express, { Request, Response } from "express"
import initDB from "./config/db";
import { usersRoutes } from "./modules/users/users.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingsRoutes } from "./modules/bookings/bookings.routes";

const app = express();

app.use(express.json());

initDB();

app.use("/api/v1/users", usersRoutes);

app.use("/api/v1/vehicles", vehiclesRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/bookings", bookingsRoutes);



app.get('/', (req: Request, res: Response) => {
    res.send('Hello World! Programming hero assignment2');
});

app.post("/", (req: Request, res: Response) => {
    console.log(req.body);

    res.status(201).json({
        success: true,
        message: "API is working"
    })
});

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    })
});

export default app;