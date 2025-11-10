const mongoose = require('mongoose');

const AnalyticsEventSchema = new mongoose.Schema({
  type: { type: String, enum: ['view', 'favorite', 'unfavorite', 'share', 'create_quote'], required: true },
  quote: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('AnalyticsEvent', AnalyticsEventSchema);

