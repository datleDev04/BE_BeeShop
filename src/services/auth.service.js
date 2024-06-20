import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from 'bcrypt'
import jwtUtils from "../utils/jwt.js";
import token from "../models/token.js";

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

        await token.create({
            user_id: user._id,
            refresh_token: refreshToken,
        });


        return {
            user,
            accessToken,
            refreshToken
        }
    }
}