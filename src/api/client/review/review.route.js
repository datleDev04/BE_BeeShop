import express from 'express';
import { reviewController } from './review.controller.js';
import { authMiddleware } from '../../../middleware/authMiddleware.js';
import { addReviewValidation } from './review.validation.js'
const reviewRouter = express.Router();

reviewRouter.post('/', authMiddleware, addReviewValidation, reviewController.addReview);

export { reviewRouter };
