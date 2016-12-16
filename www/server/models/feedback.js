import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  product_id: { type: 'String', required: true },
  user: { type: 'String', required: true },
  delivery_time: { type: 'String', required: true },
  note: { type: 'String', required: true },
  text: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Feedback', feedbackSchema);
