import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/ApiError.js"
import jwtUtils from "../utils/jwt.js"
import Black_tokens from "../models/Black_tokens.js"
import User from "../models/User.js"

export const authMiddleware = async (req, res, next) => {
    const accessToken = req.get("Authorization")?.split(" ").at(1)
    // console.log(accessToken)
    try {
        if (!accessToken) throw new ApiError(StatusCodes.UNAUTHORIZED, "Not authorized")

        const blackToken = await Black_tokens.findOne({ accessToken })
        if (blackToken) throw new ApiError(StatusCodes.UNAUTHORIZED, "Token is already expired")

        const { user_id } = jwtUtils.decodeToken(accessToken)

        const user = await User.findById(user_id)
        if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found")

        req.user = {
            ...user,
            accessToken
        }

        next()
    } catch (error) {
        next(
            new ApiError(StatusCodes.UNAUTHORIZED, new Error(error).message)
        )
    }
}   