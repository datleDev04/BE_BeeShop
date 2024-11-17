import express from "express";
import { labelController } from "./label.controller.js"
const labelRouter = express.Router()

labelRouter.get('/', labelController.getAllLabels)

export { labelRouter }