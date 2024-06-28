import express from "express";
import { roleValidation } from "../validations/roleValidation.js";
import { RoleController } from "../controllers/role.controller.js";

const roleRouter = express.Router();

roleRouter.get('/', RoleController.getAllRole )
roleRouter.get('/:id', RoleController.getOneRole )
roleRouter.post('/create', roleValidation , RoleController.createNewRole )
roleRouter.patch('/:id/update', roleValidation , RoleController.updateRoleById )
roleRouter.delete('/:id/delete' , RoleController.deleteRoleById )

export default roleRouter