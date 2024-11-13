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
import sizeRouter from './size.js';
import voucherRouter from './voucher.js';
import productTypeRouter from './product_type.js';
import productRouter from './product.js';
import docsRouter from './docs_swagger.js';
import bannerRouter from './banner.js';
import shippingMethodRouter from './shipping_method.js';
import orderRouter from './order.js';
import { statsRouter } from '../api/client/stats/stats.route.js'

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
router.use('/vouchers', voucherRouter);
router.use('/colors', colorRouter);
router.use('/sizes', sizeRouter);
router.use('/product-types', productTypeRouter);
router.use('/products', productRouter);
router.use('/banners', bannerRouter);
router.use('/orders', orderRouter);
router.use('/shipping-methods', shippingMethodRouter);
router.use('/docs-swagger', docsRouter);

router.use('/stats', statsRouter);

export default router;
