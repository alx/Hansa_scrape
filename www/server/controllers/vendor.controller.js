import Vendor from '../models/vendor';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
export function getVendors(req, res) {
  Vendor.find().sort('-dateAdded').exec((err, posts) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ posts });
  });
}

/**
 * Save a vendor
 * @param req
 * @param res
 * @returns void
 */
export function addVendor(req, res) {
  if (!req.body.vendor.name ||
      !req.body.vendor.url
  ) {
    res.status(403).end();
  }

  const newVendor = new Vendor(req.body.vendor);

  // Let's sanitize inputs
  newVendor.name = sanitizeHtml(newVendor.name);
  newVendor.url = sanitizeHtml(newVendor.url);

  newVendor.cuid = cuid();
  newVendor.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ vendor: saved });
  });
}

/**
 * Get a single vendor
 * @param req
 * @param res
 * @returns void
 */
export function getVendor(req, res) {
  Vendor.findOne({ cuid: req.params.cuid }).exec((err, vendor) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ vendor });
  });
}

/**
 * Delete a vendor
 * @param req
 * @param res
 * @returns void
 */
export function deleteVendor(req, res) {
  Vendor.findOne({ cuid: req.params.cuid }).exec((err, vendor) => {
    if (err) {
      res.status(500).send(err);
    }

    vendor.remove(() => {
      res.status(200).end();
    });
  });
}
