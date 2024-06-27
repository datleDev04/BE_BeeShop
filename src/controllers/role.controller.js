import { Transformer } from "../utils/transformer.js"

export class RoleController {
    static createNewRole = async () => {
        try {
            const newRole = await AuthService.createNewRole(req)

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