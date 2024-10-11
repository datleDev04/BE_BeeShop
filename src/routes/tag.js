import express from 'express';
import { TagController } from '../controllers/tag.controller.js';
import { createTagValidation, updateTagValidation } from '../validations/tag.validation.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const tagRouter = express.Router();

tagRouter.get(
  '/',
  authMiddleware,
  // CheckPermission(['Read_Tag']),
  TagController.getAllTags
);
tagRouter.get(
  '/:id',
  authMiddleware,
  // CheckPermission(['Read_Tag']),
  objectIdValidation,
  TagController.getOneTag
);

// create a new tag
tagRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_Tag']),
  createTagValidation,
  TagController.createTag
);

// update a tag by id
tagRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Tag']),
  objectIdValidation,
  updateTagValidation,
  TagController.updateTagById
);

// delete a tag by id
tagRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_Tag']),
  objectIdValidation,
  TagController.deleteTagById
);

export default tagRouter;
