import express from 'express';
import { roleValidation, updateRoleValidation } from '../validations/role.validation.js';
import { RoleController } from '../controllers/role.controller.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const roleRouter = express.Router();

roleRouter.get('/', authMiddleware, CheckPermission('Read_Role'), RoleController.getAllRole);
roleRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission('Read_Role'),
  objectIdValidation,
  RoleController.getOneRole
);
roleRouter.post(
  '/',
  authMiddleware,
  CheckPermission('Create_Role'),
  roleValidation,
  RoleController.createNewRole
);
roleRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission('Update_Role'),
  objectIdValidation,
  updateRoleValidation,
  RoleController.updateRoleById
);
roleRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission('Delete_Role'),
  objectIdValidation,
  RoleController.deleteRoleById
);

export default roleRouter;
