const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  tableNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table', 
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  // startTime: {
  //   type: Date,
  //   required: true,
  //   get: (startTime) => startTime && startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //   set: (startTime) => new Date(`2000-01-01 ${startTime}`), 
  // },
  startTime: {
    type: String, // Change the type to String
    required: true,
  },
  
  numberOfGuests: {
    type: Number, 
    required: true,
  },
});

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;




