import { Router } from 'express';
import { vendorController } from '../controllers/vendor.controller';

const router = Router();

router.get('/', vendorController.getAllVendors);
router.post('/', vendorController.saveVendor);

export default router;
