import { StatusCodes } from "http-status-codes"
import RoleService from "../services/role.service.js"
import { Transformer } from "../utils/transformer.js"

export class RoleController {
    static getAllRole = async (req, res, next) => {
        try {
            const roles = await RoleService.getAllRole(req)

            const returnData = roles.map(role => {
                return Transformer.transformObjectTypeSnakeToCamel(role.toObject())
            })

            res.status(StatusCodes.OK).json({
                message: "Get All Role successfully",
                statusCode: StatusCodes.OK,
                metaData: returnData
            })
        } catch (error) {
            next(error)
        }
    }
    static getOneRole = async (req, res, next) => {
        try {
            const role = await RoleService.getOneRole(req)


            res.status(StatusCodes.OK).json({
                message: "Get One Role successfully",
                statusCode: StatusCodes.OK,
                metaData: Transformer.transformObjectTypeSnakeToCamel(role.toObject())
            })
        } catch (error) {
            next(error)
        }
    }

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

    static updateRoleById = async (req, res, next) => {
        try {
            const updatedRole = await RoleService.updateRoleById(req)

            res.status(StatusCodes.OK).json({
                message: "Updated Role successfully",
                statusCode: StatusCodes.OK,
                metaData: Transformer.transformObjectTypeSnakeToCamel(updatedRole.toObject())
            })
        } catch (error) {
            next(error)
        }
    }

    static deleteRoleById = async (req, res, next) => {
        try {
            await RoleService.deleteRoleById(req)

            res.status(StatusCodes.OK).json({
                message: "Deleted Role successfully",
                statusCode: StatusCodes.OK,
            })
        } catch (error) {
            next(error)
        }
    }
}