const Joi = require("joi");

exports.validateUser = (_reqBody) => {
  const userSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(), // Assuming a minimum length of 6 characters for the password
  });

  return userSchema.validate(_reqBody);
};
