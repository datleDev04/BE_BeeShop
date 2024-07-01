import express from 'express';
import { permissionValidation } from '../validations/roleValidation.js';
import { PermissionController } from '../controllers/permission.controller.js';

const permissionRouter = express.Router();

permissionRouter.get('/', PermissionController.getAllPermissions);
permissionRouter.get('/:id', PermissionController.getPermission);
permissionRouter.post('/', permissionValidation, PermissionController.createNewPermission);
permissionRouter.patch('/:id', permissionValidation, PermissionController.updatePermission);
permissionRouter.delete('/:id', PermissionController.deletePermission);

export default permissionRouter;
