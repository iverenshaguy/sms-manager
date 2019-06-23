import '@babel/register';
import getServer from './server';

(async () => {
  const { start } = await getServer();

  start();
})();
