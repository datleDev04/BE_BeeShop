import express from "express";
import { objectIdValidation } from "../../validations/objectId.validation.js";
import { TagController } from "../../controllers/tag.controller.js";

const tagClientRouter = express.Router();


tagClientRouter.get('/',TagController.getAllTags);
tagClientRouter.get(
  '/:id',
  objectIdValidation,
  TagController.getOneTag
);

export default tagClientRouter