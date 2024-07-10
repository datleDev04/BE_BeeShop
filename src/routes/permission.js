import express from 'express';
import { PermissionController } from '../controllers/permission.controller.js';
import { objectIdValidation } from '../validations/objectId.validation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import { createPermissionValidation, updatePermissionValidation } from '../validations/permission.validation.js';

const permissionRouter = express.Router();

permissionRouter.get(
  '/',
  authMiddleware,
  CheckPermission(['Read_Permission', 'All_Permission_Permission']), 
  PermissionController.getAllPermissions
);
permissionRouter.get(
  '/:id', 
  authMiddleware,
  CheckPermission(['Read_Permission', 'All_Permission_Permission']), 
  objectIdValidation, 
  PermissionController.getPermission
);
permissionRouter.get(
  '/parent_id/:id', 
  authMiddleware,
  CheckPermission(['Read_Permission', 'All_Permission_Permission']), 
  objectIdValidation, 
  PermissionController.getPermissionByParentId
);
permissionRouter.post(
  '/', 
  authMiddleware,
  CheckPermission(['Create_Permission', 'All_Permission_Permission']), 
  createPermissionValidation, 
  PermissionController.createNewPermission
);
permissionRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Permission', 'All_Permission_Permission']), 
  objectIdValidation,
  updatePermissionValidation,
  PermissionController.updatePermission
);
permissionRouter.delete(
  '/:id', 
  authMiddleware,
  CheckPermission(['Delete_Permission', 'All_Permission_Permission']), 
  objectIdValidation, 
  PermissionController.deletePermission
);

export default permissionRouter;
