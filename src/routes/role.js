import express from 'express';
import { roleValidation } from '../validations/roleValidation.js';
import { RoleController } from '../controllers/role.controller.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';

const roleRouter = express.Router();

roleRouter.get('/', RoleController.getAllRole);
roleRouter.get('/:id', objectIdValidation, RoleController.getOneRole);
roleRouter.post('/', roleValidation, RoleController.createNewRole);
roleRouter.patch('/:id', objectIdValidation, roleValidation, RoleController.updateRoleById);
roleRouter.delete('/:id', objectIdValidation, RoleController.deleteRoleById);

export default roleRouter;
