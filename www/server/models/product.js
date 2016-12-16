import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
  website_id: { type: 'String', required: true },
  name: { type: 'String', required: true },
  price_usd: { type: 'String', required: true },
  price_btc: { type: 'String', required: true },
  vendor_id: { type: 'String', required: true },
  product_type: { type: 'String', required: true },
  delivery: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Post', postSchema);
