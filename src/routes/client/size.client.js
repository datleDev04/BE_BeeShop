import express from "express";
import { objectIdValidation } from "../../validations/objectId.validation.js";
import { SizeController } from "../../controllers/size.controller.js";

const sizeClientRouter = express.Router();


sizeClientRouter.get('/',SizeController.getAllSizes);
sizeClientRouter.get(
  '/:id',
  objectIdValidation,
  SizeController.getSize
);

export default sizeClientRouter