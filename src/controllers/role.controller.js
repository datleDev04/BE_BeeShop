import RoleService from "../services/role.service.js"
import { Transformer } from "../utils/transformer.js"

export class RoleController {
    static createNewRole = async (req, res, next) => {
        try {
            const newRole = await RoleService.createNewRole(req)

            res.status(StatusCodes.OK).json({
                message: "Create New Role successfully",
                statusCode: StatusCodes.OK,
                metaData: Transformer.transformObjectTypeSnakeToCamel(newRole.toObject())
            })
        } catch (error) {
            next(error)
        }
    }
}