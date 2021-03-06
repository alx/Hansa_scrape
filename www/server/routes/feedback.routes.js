import { Router } from 'express';
import * as FeedbackController from '../controllers/feedback.controller';
const router = new Router();

// Get all Feedbacks
router.route('/feedbacks').get(FeedbackController.getFeedbacks);

// Get one feedback by cuid
router.route('/feedbacks/:cuid').get(FeedbackController.getFeedback);

// Add a new Feedback
router.route('/feedbacks').post(FeedbackController.addFeedback);

// Delete a feedback by cuid
router.route('/feedbacks/:cuid').delete(FeedbackController.deleteFeedback);

export default router;
