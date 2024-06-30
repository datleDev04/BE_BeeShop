import { StatusCodes } from "http-status-codes";
import Role from "../models/Role.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";

export default class UserService {
    static updateUser = async (req) => {
        const { roles } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { roles: roles },
            { new: true },
        ).populate("roles").exec();

        if (!updatedUser) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Server does not response")

        return updatedUser
    }

}