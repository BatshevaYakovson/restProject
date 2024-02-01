const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String, 
    unique: true,
    required: true,
  },
  numberOfChairs: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant', 
    required: true,
  },
});

const TableModel = mongoose.model("Table", tableSchema);

module.exports = TableModel;
