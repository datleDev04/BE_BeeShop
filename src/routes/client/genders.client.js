import express from 'express';
import { GenderController } from '../../controllers/gender.controller.js';
const genderRouter = express.Router();
genderRouter.get('/', GenderController.getAllGenders);

export default genderRouter;
