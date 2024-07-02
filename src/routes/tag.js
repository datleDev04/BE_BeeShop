import express from 'express';
import { TagController } from '../controllers/tag.controller.js';
import { tagValidation } from '../validations/tag.validation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';

const tagRouter = express.Router();

tagRouter.get('/', TagController.getAllTags);
tagRouter.get('/:id',objectIdValidation, TagController.getOneTag);
tagRouter.post('/', tagValidation, TagController.createTag);
tagRouter.patch('/:id',objectIdValidation, tagValidation, TagController.updateTagById);
tagRouter.delete('/:id',objectIdValidation, TagController.deleteTagById);

export default tagRouter;
