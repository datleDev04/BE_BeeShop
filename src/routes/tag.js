import express from 'express';
import { TagController } from '../controllers/tag.controller.js';
import { tagValidation } from '../validations/tag.validation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const tagRouter = express.Router();

<<<<<<< HEAD
=======
tagRouter.get('/', TagController.getAllTags);
tagRouter.get('/:id', objectIdValidation, TagController.getOneTag);
>>>>>>> c94901f49b834d159840137d771f2e5fae0be6c5
tagRouter.get('/', authMiddleware, CheckPermission('Read_Tag'), TagController.getAllTags);
tagRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission('Read_Tag'),
  objectIdValidation,
  TagController.getOneTag
);

// create a new tag
tagRouter.post(
  '/',
  authMiddleware,
  CheckPermission('Create_Tag'),
  tagValidation,
  TagController.createTag
);

// update a tag by id
tagRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission('Update_Tag'),
  objectIdValidation,
  tagValidation,
  TagController.updateTagById
);

// delete a tag by id
tagRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission('Delete_Tag'),
  objectIdValidation,
  TagController.deleteTagById
);

export default tagRouter;
