import express from "express";
import { roleValidation } from "../validations/roleValidation.js";
import { RoleController } from "../controllers/role.controller.js";

const roleRouter = express.Router();

roleRouter.post('/add', roleValidation , RoleController.createNewRole )
// roleRouter.post('add', )

export default roleRouter