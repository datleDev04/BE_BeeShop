import express from 'express';
import { permissionValidation } from '../validations/roleValidation.js';
import { PermissionController } from '../controllers/permission.controller.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';

const permissionRouter = express.Router();

permissionRouter.get('/', PermissionController.getAllPermissions);
permissionRouter.get('/:id',objectIdValidation, PermissionController.getPermission);
permissionRouter.post('/', permissionValidation, PermissionController.createNewPermission);
permissionRouter.patch('/:id',objectIdValidation, permissionValidation, PermissionController.updatePermission);
permissionRouter.delete('/:id',objectIdValidation, PermissionController.deletePermission);

export default permissionRouter;
