import { StatusCodes } from "http-status-codes"
import { SuccessResponse } from "../../../utils/response.js"
import { statsService } from "./stats.service.js"

export const statsController = {
  getMostPurchasedSize: async (req, res, next) => {
    const result = await statsService.getMostPurchasedSize()

    SuccessResponse(res, StatusCodes.OK, 'Success', result)
  }
}