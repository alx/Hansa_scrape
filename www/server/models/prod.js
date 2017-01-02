import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const prodSchema = new Schema({
  delivery: { type: 'String', required: true },
  product: { type: 'String', required: true },
  price_usd: { type: 'String', required: true },
  price_btc: { type: 'String', required: true },
  vendor: { type: 'String', required: true },
  vendor_url: { type: 'String', required: true },
  product_id: { type: 'String', required: true },
  product_type: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});
prodSchema.set('collection', 'prod');
prodSchema.plugin(mongoosePaginate);

export default mongoose.model('prod', prodSchema);
