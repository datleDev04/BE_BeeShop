import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from 'bcrypt'
import jwtUtils from "../utils/jwt.js";
import Token from "../models/token.js";
import Black_tokens from "../models/Black_tokens.js";

export class AuthService {
    static register = async (req) => {
        const {
            user_name,
            email,
            password,
            confirm_password
        } = req.body;

        // check exitsted Email
        const existedEmail = await User.findOne({ email })
        if (existedEmail) {
            throw new ApiError(409, "Email already existed")
        }

        // check exitsted user_name
        const existedUserName = await User.findOne({ user_name })
        if (existedUserName) {
            throw new ApiError(409, "user_name already existed")
        }

        // check password and confirm_password
        if (password !== confirm_password) {
            throw new ApiError (400, "Passwords don't match")
        }

        // create a new user
        const newUser = await User.create({
            user_name,
            email,
            password: bcrypt.hashSync(password, 10),
        })

        delete newUser.password

        return newUser
    }

    static login = async (req) => {
        const { email, password } = req.body

        // find user by email
        const user = await User.findOne({ email })

        if (!user) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Couldn't find User")
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new ApiError(401, "Wrong password")
        }

        // check status of the user

        // create access token
        const accessToken = jwtUtils.createAccessToken(user._id)

        // create refresh token
        const refreshToken = jwtUtils.createRefreshToken()

        await Token.findOneAndUpdate(
            { user_id: user._id }, 
            { refresh_token: refreshToken},
            { upsert: true, new: true }
        );


        return {
            user,
            accessToken,
            refreshToken
        }
    }


    static logout = async (req) => {
        const { accessToken } = req.user;

        const { _id } = req.user._doc

        await Promise.all([

            Black_tokens.create({ 
                user_id: _id,
                access_token: accessToken
            }),

            Token.findOneAndDelete(
                { user_id: _id }
            )
        ])
    }

    static refreshToken = async (req) => {
        const refreshToken = req.body.refreshToken

        if (!refreshToken) throw new ApiError(StatusCodes.BAD_REQUEST, "refresh token is required")
        
        // check valid token
        const decodeToken = jwtUtils.decodeRefreshToken(refreshToken)
        if (!decodeToken) throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token")

        const newRefreshToken = jwtUtils.createRefreshToken()

        Token.findOneAndUpdate(
            { refresh_token: refreshToken },
            { refresh_token:  newRefreshToken }
        )

        const tokenInfo = Token.findOne({ refresh_token: newRefreshToken })

        const access_token = jwtUtils.createAccessToken(tokenInfo.user_id)

        return {
            access_token: access_token,
            refresh_token: newRefreshToken,
        }
    }


    static forgotPassword = async (reqBody) => {
        const { email } = reqBody

        if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, "email is required")

        const user = await User.findOne({ email })
        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found")

        user.resetPassword_Token = jwtUtils.createAccessToken(user._id)

        user.save()

        sendEmail(
            user.email,
            "Reset Your Instagram Account Password",
            mailForgotPassword(
                `${process.env.CLIENT_BASE_URL}/auth/reset-password/${user.resetPassword_Token}`
            )
        )
    }

    static resetPassword = async ( req ) => {
        const { password, confirm_password } = req.body

        const resetPassword_Token = req.params.token

        const decode = jwtUtils.decodeToken(resetPassword_Token)

        const user = await User.findOne({ _id: decode.user_id })
        if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or Token expired")

        if (password !== confirm_password) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Passwords don't match")
        }

        user.password = bcrypt.hashSync(password, 10)
        user.resetPassword_Token = null

        user.save()
    }
}