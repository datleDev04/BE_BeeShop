import { StatusCodes } from "http-status-codes"
import { AuthService } from "../services/auth.service.js"

export class AuthController {
    static register = async (req, res, next) => {
        try {
            const newUser = await AuthService.register(req)

            res.status(StatusCodes.OK).json({
                message: "Registration successfully",
                statusCode: StatusCodes.OK,
                metaData: newUser
            })
        } catch (error) {
            next(error)
        }
    } 
}