const mongoose = require("mongoose");

const dayOpeningHoursSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true,
    default: null, // Allow null as a default value
    get: (startTime) => startTime && startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    set: (startTime) => new Date(`2000-01-01 ${startTime}`), // Use a common date for setting
  },
  endTime: {
    type: Date,
    required: true,
    default: null, // Allow null as a default value
    get: (endTime) => endTime && endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    set: (endTime) => new Date(`2000-01-01 ${endTime}`), // Use a common date for setting
  },
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  maxSeats: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  openingHours: {
    type: {
      Monday: [dayOpeningHoursSchema],
      Tuesday: [dayOpeningHoursSchema],
      Wednesday: [dayOpeningHoursSchema],
      Thursday: [dayOpeningHoursSchema],
      Friday: [dayOpeningHoursSchema],
      Saturday: [dayOpeningHoursSchema],
      Sunday: [dayOpeningHoursSchema],
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tables: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
  }],
});

const RestaurantModel = mongoose.model("Restaurant", restaurantSchema);

module.exports = RestaurantModel;
