import express from 'express';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import {
  createFlagPageValidation,
  updateFlagPageValidation,
} from '../validations/flag_page.validation.js';
import { FlagPageController } from '../controllers/flag_page.controller.js';

const flagPageRouter = express.Router();

flagPageRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_FlagPage']),
  FlagPageController.getAllFlagPages
);
flagPageRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission(['Read_FlagPage']),
  objectIdValidation,
  FlagPageController.getFlagPage
);
flagPageRouter.post(
  '/',
  authMiddleware,
  CheckPermission(['Create_FlagPage']),
  createFlagPageValidation,
  FlagPageController.createNewFlagPage
);
flagPageRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_FlagPage']),
  objectIdValidation,
  updateFlagPageValidation,
  FlagPageController.updateFlagPage
);
flagPageRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission(['Delete_FlagPage']),
  objectIdValidation,
  FlagPageController.deleteFlagPage
);

export default flagPageRouter;
