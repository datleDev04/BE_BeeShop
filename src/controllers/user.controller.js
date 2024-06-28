import RoleService from "../services/role.service.js"
import UserService from "../services/user.service.js"

export class UserController {
    static addRoleForUser = async (req, res, next) => {
        try {
            await UserService.addRoleForUser(req)

            res.status(StatusCodes.OK).json({
                message: "Add Role For User successfully",
                statusCode: StatusCodes.OK,
                metaData: []
            })
        } catch (error) {
            next(error)
        }
    }
}