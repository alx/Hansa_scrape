import Feedback from '../models/feedback';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
export function getFeedbacks(req, res) {
  Feedback.find().sort('-dateAdded').exec((err, posts) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ posts });
  });
}

/**
 * Save a feedback
 * @param req
 * @param res
 * @returns void
 */
export function addFeedback(req, res) {
  if (!req.body.feedback.prod_id ||
      !req.body.feedback.user ||
      !req.body.feedback.delivery_time ||
      !req.body.feedback.note ||
      !req.body.feedback.text ||
      !req.body.feedback.date
  ) {
    res.status(403).end();
  }

  const newFeedback = new Feedback(req.body.feedback);

  // Let's sanitize inputs
  newFeedback.prod_id = sanitizeHtml(newFeedback.prod_id);
  newFeedback.user = sanitizeHtml(newFeedback.user);
  newFeedback.delivery_time = sanitizeHtml(newFeedback.delivery_time);
  newFeedback.note = sanitizeHtml(newFeedback.note);
  newFeedback.text = sanitizeHtml(newFeedback.text);
  newFeedback.date = sanitizeHtml(newFeedback.date);

  newFeedback.cuid = cuid();
  newFeedback.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ feedback: saved });
  });
}

/**
 * Get a single feedback
 * @param req
 * @param res
 * @returns void
 */
export function getFeedback(req, res) {
  Feedback.findOne({ cuid: req.params.cuid }).exec((err, feedback) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ feedback });
  });
}

/**
 * Delete a feedback
 * @param req
 * @param res
 * @returns void
 */
export function deleteFeedback(req, res) {
  Feedback.findOne({ cuid: req.params.cuid }).exec((err, feedback) => {
    if (err) {
      res.status(500).send(err);
    }

    feedback.remove(() => {
      res.status(200).end();
    });
  });
}
