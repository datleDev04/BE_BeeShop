import express from 'express';
import { TagController } from '../controllers/tag.controller.js';
import { tagValidation } from '../validations/tag.validation.js';

const tagRouter = express.Router();

tagRouter.get('/', TagController.getAllTags);
tagRouter.get('/:id', TagController.getOneTag);
tagRouter.post('/', tagValidation, TagController.createTag);
tagRouter.patch('/:id', tagValidation, TagController.updateTagById);
tagRouter.delete('/:id', TagController.deleteTagById);

export default tagRouter;
