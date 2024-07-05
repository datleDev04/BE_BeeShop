import express from 'express';
import authRouter from './auth.js';
import roleRouter from './role.js';
import permissionRouter from './permission.js';
import userRouter from './user.js';
import genderRouter from './gender.js';
import brandRouter from './brand.js';
import addressRouter from './address.js';
import tagRouter from './tag.js';
import labelRouter from './label.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CheckPermission } from '../utils/CheckPermission.js';
import colorRouter from './color.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/roles', authMiddleware, CheckPermission('CRUD_Role'), roleRouter);
router.use('/permissions', authMiddleware, CheckPermission('CRUD_Permission'), permissionRouter);
router.use('/genders', genderRouter);
router.use('/brands', brandRouter);
router.use('/address', addressRouter);
router.use('/tags', tagRouter);
router.use('/labels', labelRouter);
router.use('/colors', colorRouter);

export default router;
