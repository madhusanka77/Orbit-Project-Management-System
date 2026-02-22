const mongoose = require('mongoose');

const globalNoticeSchema = mongoose.Schema(
  {
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('GlobalNotice', globalNoticeSchema);