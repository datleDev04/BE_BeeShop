import { StatusCodes } from "http-status-codes";
import Role from "../models/Role.js";
import ApiError from "../utils/ApiError.js";

export default class UserService {
    static addRoleForUser = async (req) => {
        const { role } = req.body;

        // check existed role
        const existedRole = await Role.findOne({ name })
        if (existedRole) {
            throw new ApiError(StatusCodes.CONFLICT, getReasonPhrase(StatusCodes.CONFLICT))
        }

        const newRole = await Role.create({ name, permissions })

        return newRole
    }

}