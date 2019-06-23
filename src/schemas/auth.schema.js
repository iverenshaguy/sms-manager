import Joi from '@hapi/joi';

const signin = {
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
};

export default { signin };
