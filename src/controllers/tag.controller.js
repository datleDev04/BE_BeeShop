import { StatusCodes } from "http-status-codes"
import { TagService } from "../services/tag.service.js"
import { SuccessResponse } from "../utils/response.js"
import { Transformer } from "../utils/transformer.js"

export class TagController {
    static getAllTags = async (req, res, next) => {
        try {
            const tags = await TagService.getAllTags(req)

            const returnData = tags.map(tag => {
                return Transformer.transformObjectTypeSnakeToCamel(tag.toObject())
            })

            SuccessResponse(
                res,
                StatusCodes.OK,
                "Get all tag successfully",
                returnData
            )
        } catch (error) {
            next(error)
        }
    }

    static getOneTag = async (req, res, next) => {
        try {
            const tag = await TagService.getOneTag(req)

            SuccessResponse(
                res,
                StatusCodes.OK,
                "Get one tag successfully",
                Transformer.transformObjectTypeSnakeToCamel(tag.toObject())
            )
        } catch (error) {
            next(error)
        }
    }

    static createTag = async (req, res, next) => {
        try {
            const newTag = await TagService.createTag(req)
            SuccessResponse(
                res,
                StatusCodes.CREATED,
                "Create new tag successfully",
                Transformer.transformObjectTypeSnakeToCamel(newTag.toObject())
            )
        } catch (error) {
            next(error)
        }
    }

    static updateTagById= async (req, res, next) => {
        try {
            const updatedTag = await TagService.updateTagById(req)
            
            SuccessResponse(
                res,
                StatusCodes.OK,
                "Updated tag successfully",
                Transformer.transformObjectTypeSnakeToCamel(updatedTag.toObject())
            )
        } catch (error) {
            next(error)
        }
    }

    static deleteTagById = async (req, res, next) => {
        await TagService.deleteTagBydId(req)
            
        SuccessResponse(
            res,
            StatusCodes.OK,
            "deleted tag successfully",
            {}
        )
    }

}