import express from "express"
import authValidation from "../validations/authValidation.js"
import { AuthController } from "../controllers/auth.controller.js"

const authRouter = express.Router()


/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
*/
authRouter.post('/register', authValidation.registerValidation, AuthController.register)

export default authRouter