import express from 'express';
import { AddressController } from '../controllers/address.controller.js';
import { addressValidation } from '../validations/addressValidation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';

const addressRouter = express.Router();

// get all address
addressRouter.get(
  '/',
  authMiddleware,
<<<<<<< HEAD
=======
  CheckPermission('Get_All_Address'),
>>>>>>> c94901f49b834d159840137d771f2e5fae0be6c5
  CheckPermission('Read_Address'),
  AddressController.getAllAddress
);

// get address by id
<<<<<<< HEAD
=======
addressRouter.get('/:id', authMiddleware, objectIdValidation, AddressController.getOneAddress);

// create new address
addressRouter.post('/', authMiddleware, addressValidation, AddressController.createNewAddress);
>>>>>>> c94901f49b834d159840137d771f2e5fae0be6c5
addressRouter.get(
  '/:id',
  authMiddleware,
  CheckPermission('Read_Address'),
  objectIdValidation,
  AddressController.getOneAddress
);

// create new address
addressRouter.post(
  '/',
  authMiddleware,
  CheckPermission('Create_Address'),
  addressValidation,
  AddressController.createNewAddress
);

addressRouter.patch(
  '/:id',
  authMiddleware,
  CheckPermission('Update_Address'),
  objectIdValidation,
  addressValidation,
  AddressController.updateAddressById
);

addressRouter.delete(
  '/:id',
  authMiddleware,
  CheckPermission('Delete_Address'),
  objectIdValidation,
  AddressController.deleteAddressById
);

export default addressRouter;
