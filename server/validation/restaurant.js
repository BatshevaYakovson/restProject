const Joi = require("joi");

exports.validateRestaurant = (_reqBody) => {
  const dayOpeningHoursSchema = Joi.object({
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
  });

  const restaurantSchema = Joi.object({
    name: Joi.string().min(2).max(99).required(),
    imgUrl: Joi.string().min(2).required(),
    maxSeats: Joi.number().min(2),
    email: Joi.string().email().required(),
    address: Joi.string().min(2).max(99).required(),
    phone: Joi.string().required(),
    openingHours: Joi.object().keys({
      Monday: Joi.array().items(dayOpeningHoursSchema).required(),
      Tuesday: Joi.array().items(dayOpeningHoursSchema).required(),
      Wednesday: Joi.array().items(dayOpeningHoursSchema).required(),
      Thursday: Joi.array().items(dayOpeningHoursSchema).required(),
      Friday: Joi.array().items(dayOpeningHoursSchema).required(),
      Saturday: Joi.array().items(dayOpeningHoursSchema).required(),
      Sunday: Joi.array().items(dayOpeningHoursSchema).required(),
    }).required(),
    tables: Joi.array().items(Joi.string().hex().length(3)), // Assuming Table model uses ObjectId
    owner: Joi.string().hex().length(24).required(),  // Assuming owner is MongoDB ObjectId
  });

  return restaurantSchema.validate(_reqBody);
};



