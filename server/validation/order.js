const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

exports.validateOrder = (_reqBody, maxSeats) => {
  const orderSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    tableNumber: JoiObjectId().required(),
    date: Joi.date().required(),
    startTime: Joi.string().required(),
    // startTime: Joi.date().required().custom((value, helpers) => {
    //   const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    //   if (!timeRegex.test(value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))) {
    //     return helpers.message({ custom: 'Invalid time format' });
    //   }
    //   return value;
    // }),   
     numberOfGuests: Joi.number().required()
  });

  const validationResult = orderSchema.validate(_reqBody);

  if (!validationResult.error && _reqBody.numberOfGuests > maxSeats) {
    // Check if the number of guests exceeds the maximum seats in the restaurant
    if (_reqBody.numberOfGuests > maxSeats) {
      validationResult.error = {
        details: [
          {
            message: `Number of guests exceeds the maximum seats (${maxSeats}) in the restaurant.`,
            path: ["numberOfGuests"],
          },
        ],
      };
    }
  }

  return validationResult;
};

