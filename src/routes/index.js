import express from "express"
import authRouter from "./auth.js"
import authValidation from "../validations/authValidation.js"
import { AuthController } from "../controllers/auth.controller.js"

const router = express.Router()

router.use("/auth", authRouter)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
*/
router.post('/register', authValidation.registerValidation, AuthController.register)

export default router