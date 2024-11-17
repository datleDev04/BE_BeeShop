import express from "express";
import { brandController } from "./brand.controller.js"
const brandRouter = express.Router()

brandRouter.get('/', brandController.getAllBrands)

export { brandRouter }