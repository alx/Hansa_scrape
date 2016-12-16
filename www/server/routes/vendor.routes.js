import { Router } from 'express';
import * as VendorController from '../controllers/vendor.controller';
const router = new Router();

// Get all Vendors
router.route('/vendors').get(VendorController.getPosts);

// Get one vendor by cuid
router.route('/vendors/:cuid').get(VendorController.getPost);

// Add a new Vendor
router.route('/vendors').post(VendorController.addPost);

// Delete a vendor by cuid
router.route('/vendors/:cuid').delete(VendorController.deletePost);

export default router;
