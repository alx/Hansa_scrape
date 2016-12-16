import { Router } from 'express';
import * as FeedbackController from '../controllers/feedback.controller';
const router = new Router();

// Get all Feedbacks
router.route('/feedbacks').get(FeedbackController.getPosts);

// Get one feedback by cuid
router.route('/feedbacks/:cuid').get(FeedbackController.getPost);

// Add a new Feedback
router.route('/feedbacks').post(FeedbackController.addPost);

// Delete a feedback by cuid
router.route('/feedbacks/:cuid').delete(FeedbackController.deletePost);

export default router;
