const mongoose = require('mongoose');

const clockSettingsSchema = new mongoose.Schema({
  format: {
    type: String,
    enum: ['12h', '24h'],
    default: '24h'
  },
  timezone: {
    type: String,
    default: 'UTC'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ClockSettings', clockSettingsSchema);
