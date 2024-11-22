import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response.js';
import ComplaintService from '../services/complaint.service.js';

export class ComplaintController {
  static createComplaint = async (req, res, next) => {
    try {
      const complaint = await ComplaintService.createComplaint(req);
      SuccessResponse(res, StatusCodes.OK, 'Create complaint request success', complaint);
    } catch (error) {
      next(error);
    }
  };

  static withdrawComplaint = async (req, res, next) => {
    try {
      const complaint = await ComplaintService.withdrawComplaint(req);
      SuccessResponse(res, StatusCodes.OK, 'Withdraw complaint success', complaint);
    } catch (error) {
      next(error);
    }
  };

  static updateComplaintStatusForAdmin = async (req, res, next) => {
    try {
      const complaint = await ComplaintService.updateComplaintStatusForAdmin(req);
      SuccessResponse(res, StatusCodes.OK, 'Update Complaint Status For Admin success', complaint);
    } catch (error) {
      next(error);
    }
  };

  static getUserComplaints = async (req, res, next) => {
    try {
      const { metaData } = await ComplaintService.getUserComplaints(req);
      SuccessResponse(res, StatusCodes.OK, 'Update Complaint Status For Admin success', metaData);
    } catch (error) {
      next(error);
    }
  };
  static getComplaintDetails = async (req, res, next) => {
    try {
      const complaint = await ComplaintService.getComplaintDetails(req);
      SuccessResponse(res, StatusCodes.OK, 'Update Complaint Status For Admin success', complaint);
    } catch (error) {
      next(error);
    }
  };
}
