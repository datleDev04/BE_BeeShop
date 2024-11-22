import express from 'express';
import { ComplaintController } from '../../controllers/complaint.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const complaintClientRouter = express.Router();

complaintClientRouter.post('/', authMiddleware, ComplaintController.createComplaint);

complaintClientRouter.get('/user', authMiddleware, ComplaintController.getUserComplaints);

complaintClientRouter.get('/:id', authMiddleware, ComplaintController.getComplaintDetails);

complaintClientRouter.patch('/:id', authMiddleware, ComplaintController.withdrawComplaint);

export default complaintClientRouter;
