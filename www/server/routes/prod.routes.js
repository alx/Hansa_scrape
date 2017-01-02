import { Router } from 'express';
import * as ProdController from '../controllers/prod.controller';
const router = new Router();

// Get all Prods
router.route('/prods').get(ProdController.getProds);

// Get one prod by cuid
router.route('/prods/:cuid').get(ProdController.getProd);

// Add a new Prod
router.route('/prods').post(ProdController.addProd);

// Delete a prod by cuid
router.route('/prods/:cuid').delete(ProdController.deleteProd);

export default router;
