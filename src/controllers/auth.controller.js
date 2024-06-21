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

    static logout = async (req, res, next) => {
        try {
            await AuthService.logout(req)

            res.status(StatusCodes.OK).json({
                message: "Logout successfully",
            })
        } catch (error) {
            next(error);
        }
    }

    static forgotPassword = async (req, res, next) => {
        try {
            await AuthService.forgotPassword(req.body)

            res.status(StatusCodes.OK).json({
                message: "send mail forgot password successfully",
            })
        } catch (error) {
            next(error);
        }
    }
    static resetPassword = async (req, res, next) => {
        try {
            await AuthService.resetPassword(req)

            res.status(StatusCodes.OK).json({
                message: "reset password successfully",
            })
        } catch (error) {
            next(error);
        }
    }

    static refreshToken = async (req, res, next) => {
        try {
            const {access_token, refresh_token } = await AuthService.refreshToken(req)
 
            res.status(StatusCodes.OK).json({
                message: "Refresh token successfully",
                accessToken: access_token,
                refreshToken: refresh_token
            })
        } catch (error) {
            next(error)
        }
    }
}