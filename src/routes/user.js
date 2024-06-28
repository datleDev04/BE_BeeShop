import express from "express";
import { UserController } from "../controllers/user.controller.js";

const userRouter = express.Router();



// only admin role can access
userRouter.patch('/:id' , UserController.updateUser)

export default userRouter