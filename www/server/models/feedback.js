import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  prod_id: { type: 'String', required: true },
  user: { type: 'String', required: true },
  delivery_time: { type: 'String', required: true },
  note: { type: 'String', required: true },
  text: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  date: { type: 'Date', default: Date.now, required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});
feedbackSchema.set('collection', 'feedback');

export default mongoose.model('feedback', feedbackSchema);
