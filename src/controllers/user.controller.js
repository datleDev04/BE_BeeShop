import { StatusCodes } from "http-status-codes"
import UserService from "../services/user.service.js"
import { Transformer } from "../utils/transformer.js"
import { SuccessResponse } from "../utils/response.js"

export class UserController {
    static updateUser = async (req, res, next) => {
        try {
            const updatedUser = await UserService.updateUser(req)


            SuccessResponse(
                res,
                StatusCodes.OK,
                "Updated User successfully",
                Transformer.transformObjectTypeSnakeToCamel(updatedUser.toObject())
            ) 
        } catch (error) {
            next(error)
        }
    }
}