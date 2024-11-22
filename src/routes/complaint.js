import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { ComplaintController } from '../controllers/complaint.controller.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const complaintAdminRouter = express.Router();

complaintAdminRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission(['Update_Complaint']),
  ComplaintController.updateComplaintStatusForAdmin
);

export default complaintAdminRouter;
