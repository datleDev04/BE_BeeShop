import { StatusCodes } from "http-status-codes"
import { AuthService } from "../services/auth.service.js"
import { Transformer } from "../utils/transformer.js"

export class AuthController {
    static register = async (req, res, next) => {
        try {
            const newUser = await AuthService.register(req)
            console.log(Transformer.transformObjectTypeSnakeToCamel(newUser.toObject()))

            res.status(StatusCodes.OK).json({
                message: "Registration successfully",
                statusCode: StatusCodes.OK,
                metaData: Transformer.transformObjectTypeSnakeToCamel(newUser.toObject())
            })
        } catch (error) {
            next(error)
        }
    } 
}