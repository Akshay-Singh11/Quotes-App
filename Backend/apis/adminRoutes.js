const express = require('express');
const User = require('../models/User');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const { auth, adminOnly } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/admin/analytics', auth, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalQuotes] = await Promise.all([
      User.countDocuments(),
      mongoose.connection.collection('quotes').countDocuments()
    ]);

    // Top quotes by favorites (from users' favorites arrays)
    const topQuotesAgg = await User.aggregate([
      { $unwind: '$favorites' },
      { $group: { _id: '$favorites', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'quotes', localField: '_id', foreignField: '_id', as: 'quote' } },
      { $unwind: '$quote' },
      { $project: { _id: 0, quoteId: '$quote._id', author: '$quote.author', text: '$quote.text', favorites: '$count' } }
    ]);

    // Events last 7 days grouped by day and type
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const eventsAgg = await AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, type: '$type' }, count: { $sum: 1 } } },
      { $sort: { '_id.day': 1 } }
    ]);

    res.json({ totalUsers, totalQuotes, topQuotes: topQuotesAgg, eventsLast7Days: eventsAgg });
  } catch (e) {
    console.error('Analytics error', e);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

module.exports = router;

