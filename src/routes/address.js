import express from 'express';
import { AddressController } from '../controllers/address.controller.js';
import { addressValidation } from '../validations/addressValidation.js';
import { objectIdValidation } from '../validations/objectIdValidation.js';

const addressRouter = express.Router();

addressRouter.get('/', AddressController.getAllAddress);
addressRouter.get('/:id', objectIdValidation, AddressController.getOneAddress);
addressRouter.post('/', addressValidation, AddressController.createNewAddress);
addressRouter.patch(
  '/:id',
  objectIdValidation,
  addressValidation,
  AddressController.updateAddressById
);
addressRouter.delete('/:id', objectIdValidation, AddressController.deleteAddressById);

export default addressRouter;
