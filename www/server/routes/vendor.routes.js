import { Router } from 'express';
import * as VendorController from '../controllers/vendor.controller';
const router = new Router();

// Get all Vendors
router.route('/vendors').get(VendorController.getVendors);

// Get one vendor by cuid
router.route('/vendors/:cuid').get(VendorController.getVendors);

// Add a new Vendor
router.route('/vendors').post(VendorController.addVendor);

// Delete a vendor by cuid
router.route('/vendors/:cuid').delete(VendorController.deleteVendor);

export default router;
