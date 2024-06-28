import express from "express";
import { roleValidation } from "../validations/roleValidation.js";
import { RoleController } from "../controllers/role.controller.js";

const roleRouter = express.Router();

roleRouter.get('/', RoleController.getAllRole )
roleRouter.get('/:id', RoleController.getOneRole )
roleRouter.post('/', roleValidation , RoleController.createNewRole )
roleRouter.patch('/:id', roleValidation , RoleController.updateRoleById )
roleRouter.delete('/:id' , RoleController.deleteRoleById )

export default roleRouter