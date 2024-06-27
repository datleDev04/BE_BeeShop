import { StatusCodes } from "http-status-codes"
import PermissionService from "../services/permission.service.js"
import { Transformer } from "../utils/transformer.js"

export class PermissionController {
    static createNewPermission = async () => {
        try {
            const newRole = await PermissionService.createNewPermission(req)

            res.status(StatusCodes.CREATED).json({
                message: "Create New Permission successfully",
                statusCode: StatusCodes.CREATED,
                metaData: Transformer.transformObjectTypeSnakeToCamel(newRole.toObject())
            })
        } catch (error) {
            next(error)
        }
    }
    static getAllPermissions = async () => {
        try {
            const permissions = await PermissionService.getAllPermissions(req)

            res.status(StatusCodes.OK).json({
                message: "Get All Permission successfully",
                statusCode: StatusCodes.OK,
                metaData: Transformer.transformObjectTypeSnakeToCamel(permissions.toObject())
            })
        } catch (error) {
            next(error)
        }
    }

    static updatePermission = async () => {
        try {
            const permissions = await PermissionService.updatePermission(req)

            res.status(StatusCodes.OK).json({
                message: "Updated Permission successfully",
                statusCode: StatusCodes.OK,
                metaData: Transformer.transformObjectTypeSnakeToCamel(permissions.toObject())
            })
        } catch (error) {
            next(error)
        }
    }
    static deletePermission = async () => {
        try {
            await PermissionService.deletePermission(req)

            res.status(StatusCodes.OK).json({
                message: "Delete Permission successfully",
                statusCode: StatusCodes.OK,
                metaData: []
            })
        } catch (error) {
            next(error)
        }
    }
}