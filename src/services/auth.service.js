import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from 'bcrypt'

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

        return newUser
    }
}