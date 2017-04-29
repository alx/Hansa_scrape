import Prod from '../models/prod';
import Feedback from '../models/feedback';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';
import moment from 'moment';
import async from 'async';

// db.feedback.find().forEach(function(doc) { doc.date = new Date(doc.date); db.feedback.save(doc); })

const COLORS = {
  user: '#74C9B7',
  vendor: '#C03E3F',
  product: '#D0B554',
  edge: '#455A64'
}

function getFeedbacksByDate(start, end, callback) {
  Feedback.find({
    date: {
      $gt: start,
      $lt: end
    }
  }, 'user prod_id note').exec((err, feedbacks) => {
    callback(null, feedbacks);
  });
}

function getProducts(feedbacks, callback) {

  const product_ids = feedbacks.map( feedback => {
    return feedback.prod_id;
  }).filter((v, i, a) => a.indexOf(v) === i); // only keep uniques


  Prod.find({
    "product_id": {$in: product_ids}
  }).exec((err, products) => {
    callback(null, {feedbacks: feedbacks, products: products});
  });

}

function buildNetwork(data, callback) {

  const feedbacks = data.feedbacks;
  const products = data.products;

  const network = {nodes: [], edges: []};
  let edge_id = 0;

  products.forEach( product => {

    let vendor = network.nodes.find( node => {
      return node.id == product.vendor;
    });

    if(typeof(vendor) == 'undefined') {
      vendor = {
        id: product.vendor,
        label: product.vendor,
        color: COLORS.vendor,
        type: 'square',
        size: 0,
        metadata: {
          notes: [],
          category: 'vendor',
          nb_transactions: 0,
        }
      };
      network.nodes.push(vendor);
    }

    let product_node = network.nodes.find( node => {
      return node.id == product.product_id;
    });

    if(typeof(product_node) == 'undefined') {
      product_node = {
        id: product.product_id,
        label: product.product,
        color: COLORS.product,
        type: 'diamond',
        size: 0,
        metadata: {
          category: 'product',
          product_id: product.product_id,
          price_usd: product.price_usd,
          price_btc: product.price_btc,
          delivery: product.delivery,
          type: product.product_type,
          vendor: product.vendor,
          notes: [],
          nb_transactions: 0,
        }
      };
      network.nodes.push(product_node);
    }

    edge_id += 1;
    network.edges.push({
      id: edge_id,
      source: vendor.id,
      target: product_node.id
    });

  });

  feedbacks.forEach( feedback => {

    const related_product = network.nodes.find(node => {
      return node.id == feedback.prod_id;
    });

    const related_vendor = network.nodes.find( node => {
      return node.id == related_product.metadata.vendor;
    });

    let client = network.nodes.find( node => {
      return node.id == feedback.user;
    });

    if(typeof(client) == 'undefined') {
      client = {
        id: feedback.user,
        label: feedback.user,
        size: 0,
        color: COLORS.client,
        metadata: {
          category: 'client',
          nb_transactions: 0,
          notes: [],
        }
      };
      network.nodes.push(client);
    }

    const price_btc = parseFloat(related_product.metadata.price_btc);
    client.size += price_btc;
    related_product.size += price_btc;
    related_vendor.size += price_btc;

    client.metadata.nb_transactions += 1;
    related_product.metadata.nb_transactions += 1;
    related_vendor.metadata.nb_transactions += 1;

    client.metadata.notes.push((parseInt(feedback.note) + 1));
    related_product.metadata.notes.push((parseInt(feedback.note) + 1));
    related_vendor.metadata.notes.push((parseInt(feedback.note) + 1));

    let client_product_edge = network.edges.find( edge => {
      return (edge.source == client.id) &&
             (edge.target == related_product.id);
    });

    if(typeof(client_product_edge) != 'undefined') {
      client_product_edge.weight += 1;
    } else {
      edge_id += 1;
      network.edges.push({
        id: edge_id,
        source: client.id,
        target: related_product.id,
        weight: 1
      });
    }
  });

  network.nodes.forEach(node => {
    const notes = node.metadata.notes;
    node.metadata.mean_note = notes.reduce((a, b) => a + b) / notes.length;
    node.metadata.score = node.metadata.mean_note / 2;
  });

  callback(null, network);
}


function mapToArray(network, callback) {
  network.nodes = Object.values(network.nodes);
  network.edges = Object.values(network.edges);
  callback(null, network);
}

function randomizeNodePosition(network, callback) {
  network.nodes.forEach( node => {
    node.x = Math.random();
    node.y = Math.random();
  });
  callback(null, network);
}

export function getNetworkDuringDate(req, res) {

  const date = moment(req.params.date, "YYYY-MM");
  const start = moment(date).toISOString();
  const end = moment(date).add(1, 'month').toISOString();

  async.waterfall([
    async.apply(getFeedbacksByDate, start, end),
    getProducts,
    buildNetwork,
    randomizeNodePosition,
  ], function (error, results) {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json(results);
  });

}
