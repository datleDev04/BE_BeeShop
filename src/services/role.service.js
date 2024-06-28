import { StatusCodes } from "http-status-codes";
import Role from "../models/Role.js";
import ApiError from "../utils/ApiError.js";

export default class RoleService {
    static createNewRole = async (req) => {
        const { name, permissions } = req.body;

        const existedRole = await Role.findOne({ name })

        if (existedRole) {
            throw new ApiError(StatusCodes.CONFLICT, "This role is existed")
        }

        const newRole = await Role.create({ name, permissions })

        return newRole
    }

}