const Joi = require("joi");

exports.validateTable = (_reqBody) => {
  const tableSchema = Joi.object({
    tableNumber: Joi.string().required(),
    numberOfChairs: Joi.number().required(),
    owner: Joi.string().objectId().required(),
  });

  return tableSchema.validate(_reqBody);
};
