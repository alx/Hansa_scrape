import { Router } from 'express';
import * as ProductController from '../controllers/product.controller';
const router = new Router();

// Get all Products
router.route('/products').get(ProductController.getPosts);

// Get one product by cuid
router.route('/products/:cuid').get(ProductController.getPost);

// Add a new Product
router.route('/products').post(ProductController.addPost);

// Delete a product by cuid
router.route('/products/:cuid').delete(ProductController.deletePost);

export default router;
