import Prod from '../models/prod';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all prods
 * @param req
 * @param res
 * @returns void
 */
export function getProds(req, res) {
  Prod.paginate({}, { page: 3, limit: 10 }, (err, prods) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ prods });
  });
}

/**
 * Save a prod
 * @param req
 * @param res
 * @returns void
 */
export function addProd(req, res) {
  if (!req.body.prod.website_id ||
      !req.body.prod.name ||
      !req.body.prod.price_usd ||
      !req.body.prod.price_btc ||
      !req.body.prod.vendor_id ||
      !req.body.prod.prod_type ||
      !req.body.prod.delivery
  ) {
    res.status(403).end();
  }

  const newProd = new Prod(req.body.prod);

  // Let's sanitize inputs
  newProd.website_id = sanitizeHtml(newProd.website_id);
  newProd.name = sanitizeHtml(newProd.name);
  newProd.price_usd = sanitizeHtml(newProd.price_usd);
  newProd.price_btc = sanitizeHtml(newProd.price_btc);
  newProd.vendor_id = sanitizeHtml(newProd.vendor_id);
  newProd.prod_type = sanitizeHtml(newProd.prod_type);
  newProd.delivery = sanitizeHtml(newProd.delivery);

  newProd.cuid = cuid();
  newProd.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ prod: saved });
  });
}

/**
 * Get a single prod
 * @param req
 * @param res
 * @returns void
 */
export function getProd(req, res) {
  Prod.findOne({ cuid: req.params.cuid }).exec((err, prod) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ prod });
  });
}

/**
 * Delete a prod
 * @param req
 * @param res
 * @returns void
 */
export function deleteProd(req, res) {
  Prod.findOne({ cuid: req.params.cuid }).exec((err, prod) => {
    if (err) {
      res.status(500).send(err);
    }

    prod.remove(() => {
      res.status(200).end();
    });
  });
}
