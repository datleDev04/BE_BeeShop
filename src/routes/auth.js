import express from "express"
import authValidation from "../validations/authValidation.js"
import { AuthController } from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post('/register', authValidation.registerValidation, AuthController.register)

export default authRouter