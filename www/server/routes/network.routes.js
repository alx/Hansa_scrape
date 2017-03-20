import { Router } from 'express';
import * as NetworkController from '../controllers/network.controller';
const router = new Router();

router.route('/network').get(NetworkController.getNetwork);
router.route('/network/:date').get(NetworkController.getNetworkDuringDate);

export default router;
