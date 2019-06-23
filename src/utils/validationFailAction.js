import Boom from '@hapi/boom';
import { config as getEnv } from 'dotenv';

import getErrorDetails from './getErrorDetails';

getEnv();

/**
 * Joi validation fail action
 *
 * @param {object} request hapijs request object
 * @param {object} h hapijs response object
 * @param {object} error joi error object
 *
 * @returns {error} formatted joi error object
 */
async function validationFailAction(request, h, error) {
  if (error.name === 'ValidationError') {
    const errorResponse = Boom.badRequest(
      'This request cannot be completed due to invalid input',
      getErrorDetails(error.details)
    );
    errorResponse.output.payload.details = errorResponse.data;

    return errorResponse;
  }

  throw error;
}

export default validationFailAction;
