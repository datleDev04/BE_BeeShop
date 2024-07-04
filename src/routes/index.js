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
import colorRouter from './color.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/roles', roleRouter);
router.use('/permissions', permissionRouter);
router.use('/genders', genderRouter);
router.use('/brands', brandRouter);
router.use('/address', addressRouter);
router.use('/tags', tagRouter);
router.use('/labels', labelRouter);
router.use('/colors', colorRouter);

export default router;
