import { Router } from 'express';
import * as ChartController from '../controllers/chart.controller';
const router = new Router();

router.route('/charts/weekly').get(ChartController.getWeekly);
router.route('/charts/weekly/:date').get(ChartController.getWeeklyNumber);

export default router;
