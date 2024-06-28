import { StatusCodes } from "http-status-codes"
import UserService from "../services/user.service.js"
import { Transformer } from "../utils/transformer.js"

export class UserController {
    static updateUser = async (req, res, next) => {
        try {
            const updatedUser = await UserService.updateUser(req)

            res.status(StatusCodes.OK).json({
                message: "Updated User successfully",
                statusCode: StatusCodes.OK,
                metaData: Transformer.transformObjectTypeSnakeToCamel(updatedUser.toObject())
            })
        } catch (error) {
            next(error)
        }
    }
}