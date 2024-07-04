import express from 'express';
import { GenderController } from '../controllers/gender.controller.js';
import { genderValidation } from '../validations/genderValidation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const genderRouter = express.Router();

genderRouter.get('/', GenderController.getAllGenders);
genderRouter.get('/:id',objectIdValidation, GenderController.getGender);
genderRouter.post('/', authMiddleware,genderValidation, GenderController.createNewGender);
genderRouter.patch('/:id', objectIdValidation, genderValidation, GenderController.updateGender);
genderRouter.delete('/:id', objectIdValidation, GenderController.deleteGender);

export default genderRouter;
