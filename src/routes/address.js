import express from 'express';
import { AddressController } from '../controllers/address.controller.js';
import { addressValidation } from '../validations/addressValidation.js';

const addressRouter = express.Router();

addressRouter.get('/', AddressController.getAllAddress);
addressRouter.get('/:id', AddressController.getOneAddress);
addressRouter.post('/', addressValidation, AddressController.createNewAddress);
addressRouter.patch('/:id', addressValidation, AddressController.updateAddressById);
addressRouter.delete('/:id', AddressController.deleteAddressById);

export default addressRouter;
