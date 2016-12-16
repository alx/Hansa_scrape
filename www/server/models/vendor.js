import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  name: { type: 'String', required: true },
  url: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Vendor', vendorSchema);
