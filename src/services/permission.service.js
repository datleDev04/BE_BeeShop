import Permisson from "../models/Permisson.js";
import Role from "../models/Role.js";

export default class PermissionService {
    static createNewPermission = async (req) => {
        const { name } = req.body;

        // check existed permissions
        const existedPermission = await Permisson.findOne({ name })
        if (existedPermission) {
            throw new ApiError(409, "Email already existed")
        }

        const newPermission = await Permisson.create({ name })

        return newPermission
    }

    static getAllPermissions = async () => {
        const permissions = await Permisson.find()

        if (!permissions) {
            return []
        }

        return permissions
    }

    static updatePermission = async (req, res) => {

        const { id } = req.params

        const permission = Permisson.findByIdAndUpdate(
            { id },
            { name: req.body.name },
            { new: true }
        )

        if (!permission) {
            throw new ApiError(404, "Permission not found")
        }

        return permission
    }

    static deletePermission = async (req, res) => {
        const { id } = req.params

        const permission = await Permisson.findByIdAndDelete(id)

        if (!permission) {
            throw new ApiError(404, "Permission not found")
        }

        await Role.updateMany(
            { permissions: id },
            { $pull: { permissions: id } }
        );

    }
}