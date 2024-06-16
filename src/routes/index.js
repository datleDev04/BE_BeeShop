import express from "express"
import authRouter from "./auth.js"
import authValidation from "../validations/authValidation.js"
import { AuthController } from "../controllers/auth.controller.js"

const router = express.Router()

router.use("/auth", authRouter)


export default router