import { StatusCodes } from "http-status-codes"
import PermissionService from "../services/permission.service.js"
import { Transformer } from "../utils/transformer.js"

export class PermissionController {
    static createNewPermission = async (req, res, next) => {
        try {
            const newPermission = await PermissionService.createNewPermission(req)

            res.status(StatusCodes.CREATED).json({
                message: "Create New Permission successfully",
                statusCode: StatusCodes.CREATED,
                metaData: Transformer.transformObjectTypeSnakeToCamel(newPermission.toObject())
            })
        } catch (error) {
            next(error)
        }
    }
    static getPermission = async (req, res, next) => {
        try {
            const permission = await PermissionService.getPermission(req)

            res.status(StatusCodes.OK).json({
                message: "Get Permission successfully",
                statusCode: StatusCodes.OK,
                metaData: Transformer.transformObjectTypeSnakeToCamel(permission.toObject())
            })
        } catch (error) {
            next(error)
        }
    }
    static getAllPermissions = async (req, res, next) => {
        try {
            const permissions = await PermissionService.getAllPermissions(req)

            const returnData = await permissions.map(permission => {
                return Transformer.transformObjectTypeSnakeToCamel(permission.toObject())
            })

            res.status(StatusCodes.OK).json({
                message: "Get All Permission successfully",
                statusCode: StatusCodes.OK,
                // cần xem xét thêm vì trả về là 1 mảng
                metaData: returnData
            })
        } catch (error) {
            next(error)
        }
    }

    static updatePermission = async (req, res, next) => {
        try {
            const permissions = await PermissionService.updatePermission(req)

            res.status(StatusCodes.OK).json({
                message: "Updated Permission successfully",
                statusCode: StatusCodes.OK,
                metaData:  Transformer.transformObjectTypeSnakeToCamel(permissions.toObject())
            })
        } catch (error) {
            next(error)
        }
    }
    static deletePermission = async (req, res, next) => {
        try {
            const deletedPermission = await PermissionService.deletePermission(req)

            res.status(StatusCodes.OK).json({
                message: "Delete Permission successfully",
                statusCode: StatusCodes.OK,
                metaData: Transformer.transformObjectTypeSnakeToCamel(deletedPermission.toObject())
            })
        } catch (error) {
            next(error)
        }
    }
}