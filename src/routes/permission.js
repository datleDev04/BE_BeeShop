import express from 'express';
import { permissionValidation } from '../validations/roleValidation.js';
import { PermissionController } from '../controllers/permission.controller.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const permissionRouter = express.Router();

permissionRouter.get(
  '/',
  authMiddleware,
  CheckPermission('Read_Permission'), 
  PermissionController.getAllPermissions
);
permissionRouter.get(
  '/:id', 
  authMiddleware,
  CheckPermission('Read_Permission'), 
  objectIdValidation, 
  PermissionController.getPermission
);
permissionRouter.post(
  '/', 
  permissionValidation, 
  authMiddleware,
  CheckPermission('Create_Permission'), 
  PermissionController.createNewPermission
);
permissionRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission('Update_Permission'), 
  objectIdValidation,
  permissionValidation,
  PermissionController.updatePermission
);
permissionRouter.delete(
  '/:id', 
  authMiddleware,
  CheckPermission('Delete_Permission'), 
  objectIdValidation, 
  PermissionController.deletePermission
);

export default permissionRouter;
