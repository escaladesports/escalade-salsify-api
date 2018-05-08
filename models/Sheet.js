const mongoose = require('mongoose');
const SheetSchema = new mongoose.Schema({
  sheetId: String,
  status: String,
  url: String
});
module.exports = mongoose.model('Sheet', SheetSchema);
