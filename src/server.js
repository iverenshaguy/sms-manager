import glue from '@hapi/glue';
import Boom from '@hapi/boom';

import logger from './utils/logger';
import manifest from './config/manifest';

const getServer = async () => {
  try {
    const server = await glue.compose(manifest, { relativeTo: __dirname });

    // catch all route
    server.route({
      method: '*',
      path: '/{any*}',
      handler() {
        return Boom.notFound('Resource not found');
      }
    });

    const init = async () => {
      await server.initialize();
      return server;
    };

    const start = async () => {
      await server.start();
      logger.info(`Server running at: ${server.info.uri}`);
      return server;
    };

    return { init, start };
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

export default getServer;
