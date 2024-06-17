import { StatusCodes } from "http-status-codes"
import { AuthService } from "../services/auth.service.js"
import { Transformer } from "../utils/transformer.js"

export class AuthController {
    static register = async (req, res, next) => {
        try {
            const newUser = await AuthService.register(req)

            res.status(StatusCodes.OK).json({
                message: "Registration successfully",
                statusCode: StatusCodes.OK,
                metaData: Transformer.transformObjectTypeSnakeToCamel(newUser.toObject())
            })
        } catch (error) {
            next(error)
        }
    }
    
    static login = async (req, res, next) => {
        try {
            const { user, accessToken, refreshToken } = await AuthService.login( req ) 

            res.status(StatusCodes.OK).json({
                message: "Login successfully",
                metaData: {
                    userData: Transformer.transformObjectTypeSnakeToCamel(user.toObject()),
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            })
        } catch (error) {
            next(error);
        }
    }
}