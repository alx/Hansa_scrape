import Prod from '../models/prod';
import Feedback from '../models/feedback';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';
import moment from 'moment';

// db.feedback.find().forEach(function(doc) { doc.date = new Date(doc.date); db.feedback.save(doc); })

export function getWeekly(req, res) {
  let chartData = {};
  Feedback.find({}, (err, feedbacks) => {

    feedbacks.forEach( feedback => {
      Prod.find({"_id": feedback.product_id}, (err, prod) => {

        const weekNumber = moment(prod.date).format("chart-YYYY-ww");

        if(!chartData[weekNumber])
          chartData[weekNumber] = {}

        if(!chartData[weekNumber][prod.product_type]) {
          chartData[weekNumber][prod.product_type] = {
            name: prod.product_type,
            count: 1
          };
        } else {
          chartData[weekNumber][prod.product_type].count += 1;
        }
      });

    });

    res.json({chartData});

  });
}

export function getWeeklyNumber(req, res) {
  let chartData = {};
  let chartInfo = {
    'Cannabis': {count: 0, amount_btc: 0, vendors: []},
    'Stimulants': {count: 0, amount_btc: 0, vendors: []},
    'Ecstasy': {count: 0, amount_btc: 0, vendors: []},
    'Psychedelics': {count: 0, amount_btc: 0, vendors: []},
    'Dissociatives': {count: 0, amount_btc: 0, vendors: []},
    'Prescription': {count: 0, amount_btc: 0, vendors: []},
    'Opioids': {count: 0, amount_btc: 0, vendors: []}
  };
  const date = moment(req.params.date, "YYYY-MM");
  Feedback.find({
    date: {
      $gt: moment(date).toISOString(),
      $lt: moment(date).add(1, 'month').toISOString(),
    }
  }, 'prod_id').exec((err, feedbacks) => {

    Prod.find({
      "product_type": /Drugs/,
      "product_id": {
        $in: feedbacks.map(feed => feed.prod_id)
      }
    }).exec((err, prods) => {

      prods.forEach( prod => {
        const subtype = prod.product_type.split('/')[1];

        if(chartInfo[subtype]) {
          chartInfo[subtype].count += 1;
          chartInfo[subtype].amount_btc += parseFloat(prod.price_btc);
          if(chartInfo[subtype].vendors.indexOf(prod.vendor) == -1) {
            chartInfo[subtype].vendors.push(prod.vendor)
          }
        }
      });

      chartData.byProduct = Object.keys(chartInfo).map( (key, index) => {
        return {
          id: key,
          subtype: key,
          count: chartInfo[key].count,
          amount_btc: chartInfo[key].amount_btc,
          vendors: chartInfo[key].vendors,
        };
      });

      let bySubtype = {};
      chartData.byProduct.forEach( product => {
        if(!bySubtype[product.subtype]) {
          bySubtype[product.subtype] = product;
        } else {
          bySubtype[product.subtype].count += product.count;
          bySubtype[product.subtype].amount_btc += product.amount_btc;
          bySubtype[product.subtype].vendors = bySubtype[product.subtype].vendors.concat(product.vendors);
        }
      });
      chartData.bySubtype = Object.keys(bySubtype).sort().map( (key, index) => {
        return {
          id: key,
          type: "Drugs",
          subtype: key,
          count: bySubtype[key].count,
          amount_btc: bySubtype[key].amount_btc,
          vendors: bySubtype[key].vendors,
        };
      });

      res.json({chartData});

    });

  });
}
