import Product from '../models/product';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
export function getProducts(req, res) {
  Product.find().sort('-dateAdded').exec((err, posts) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ posts });
  });
}

/**
 * Save a product
 * @param req
 * @param res
 * @returns void
 */
export function addProduct(req, res) {
  if (!req.body.product.website_id ||
      !req.body.product.name ||
      !req.body.product.price_usd ||
      !req.body.product.price_btc ||
      !req.body.product.vendor_id ||
      !req.body.product.product_type ||
      !req.body.product.delivery
  ) {
    res.status(403).end();
  }

  const newProduct = new Product(req.body.product);

  // Let's sanitize inputs
  newProduct.website_id = sanitizeHtml(newProduct.website_id);
  newProduct.name = sanitizeHtml(newProduct.name);
  newProduct.price_usd = sanitizeHtml(newProduct.price_usd);
  newProduct.price_btc = sanitizeHtml(newProduct.price_btc);
  newProduct.vendor_id = sanitizeHtml(newProduct.vendor_id);
  newProduct.product_type = sanitizeHtml(newProduct.product_type);
  newProduct.delivery = sanitizeHtml(newProduct.delivery);

  newProduct.cuid = cuid();
  newProduct.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ product: saved });
  });
}

/**
 * Get a single product
 * @param req
 * @param res
 * @returns void
 */
export function getProduct(req, res) {
  Product.findOne({ cuid: req.params.cuid }).exec((err, product) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ product });
  });
}

/**
 * Delete a product
 * @param req
 * @param res
 * @returns void
 */
export function deleteProduct(req, res) {
  Product.findOne({ cuid: req.params.cuid }).exec((err, product) => {
    if (err) {
      res.status(500).send(err);
    }

    product.remove(() => {
      res.status(200).end();
    });
  });
}
