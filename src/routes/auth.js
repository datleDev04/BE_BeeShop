import express from "express"
import authValidation from "../validations/authValidation.js"
import { AuthController } from "../controllers/auth.controller.js"

const authRouter = express.Router()


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_name:
 *                   type: string
 *                 email:
 *                   type: string
 */
authRouter.post('/register', authValidation.registerValidation, AuthController.register)

export default authRouter