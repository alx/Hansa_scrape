import Prod from '../models/prod';
import Feedback from '../models/feedback';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';
import moment from 'moment';
import async from 'async';

// db.feedback.find().forEach(function(doc) { doc.date = new Date(doc.date); db.feedback.save(doc); })

const COLORS = {
  user: '#009688',
  vendor: '#FFC107',
  edge: '#455A64'
}

function buildFirstNetwork(feedbacks) {

  let nodes = {};
  let edges = {};

  feedbacks.forEach( feedback => {

    if(!nodes[feedback.user]) {
      nodes[feedback.user] = {id: feedback.user, size: 1, color: COLORS.user};
    } else {
      nodes[feedback.user].size += 1;
    }

    if(!nodes[feedback.prod_id]) {
      nodes[feedback.prod_id] = {id: feedback.prod_id, size: 1, color: COLORS.vendor};
    } else {
      nodes[feedback.prod_id].size += 1;
    }

    const edge_id = feedback.prod_id + '-' + feedback.user;
    if(!edges[edge_id]) {
      edges[edge_id] = {
        id: edge_id,
        source: feedback.prod_id,
        target: feedback.user,
        color: COLORS.edge,
        weight: 1
      };
    } else {
      edges[edge_id].weight += 1;
    }

  });

  return {nodes: nodes, edges: edges};
}

function getFeedbacks(callback) {
  Feedback.find({}, 'user prod_id').exec((err, feedbacks) => {
    callback(null, buildFirstNetwork(feedbacks));
  });
}

function getFeedbacksByDate(start, end, callback) {
  Feedback.find({
    date: {
      $gt: start,
      $lt: end
    }
  }, 'user prod_id').exec((err, feedbacks) => {
    callback(null, buildFirstNetwork(feedbacks));
  });
}

function getProductVendor(network, callback) {

  const vendor_nodes = Object.keys(network.nodes).filter(node_key => {
    return node_key.length > 5;
  });

  Prod.find({
    "product_id": {$in: vendor_nodes}
  }).exec((err, prods) => {
    prods.forEach(product => {
      network.nodes[product.product_id].label = product.vendor;
    });
    callback(null, network);
  });

}

function mergeVendorProducts(network, callback) {

  const product_node_keys = Object.keys(network.nodes).filter(node_key => {
    return node_key.length > 5;
  });

  product_node_keys.forEach(node_key => {

    const product_node = network.nodes[node_key];
    const vendor_label = product_node.label;

    if(!network.nodes[vendor_label]) {
      network.nodes[vendor_label] = product_node;
      network.nodes[vendor_label].id = vendor_label;
    } else {
      network.nodes[vendor_label].size += product_node.size;
    }

    Object.keys(network.edges).filter(edge_key => {
      return edge_key.indexOf(node_key) != -1;
    }).forEach(edge_key => {
      network.edges[edge_key].source = vendor_label;
    })

    delete network.nodes[node_key];

  });

  callback(null, network);
}

function mapToArray(network, callback) {
  network.nodes = Object.values(network.nodes);
  network.edges = Object.values(network.edges);
  callback(null, network);
}

export function getNetwork(req, res) {
  async.waterfall([
    getFeedbacks,
    getProductVendor,
    mergeVendorProducts,
    mapToArray,
  ], function (error, results) {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json(results);
  });
}

export function getNetworkDuringDate(req, res) {

  const date = moment(req.params.date, "YYYY-MM");
  const start = moment(date).toISOString();
  const end = moment(date).add(1, 'month').toISOString();

  async.waterfall([
    async.apply(getFeedbacksByDate, start, end),
    getProductVendor,
    mergeVendorProducts,
    mapToArray,
  ], function (error, results) {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json(results);
  });
}
