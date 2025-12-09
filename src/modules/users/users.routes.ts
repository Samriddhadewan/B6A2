import { Router } from "express";
import { usersController } from "./users.controller";
import auth from "../../middleware/auth";

const router = Router();



router.get("/", auth("admin"), usersController.getUser);

router.put("/:id", auth("admin", "customer"), usersController.updateSingleUser);

router.delete("/:id", auth("admin"), usersController.deleteSingleUser);

export const usersRoutes = router;