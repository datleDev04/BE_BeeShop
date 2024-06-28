import express from "express";

const roleRouter = express.Router();

roleRouter.post('/add', roleValidation , RoleController.createNewRole )
// roleRouter.post('add', )

export default roleRouter