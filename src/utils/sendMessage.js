/**
 * Mock message sender service
 *
 * @param  {object} instance  the message instance
 *
 * @return {function} the callback function
 */
async function sendMessage(instance) {
  const statuses = ['delivered', 'invalid', 'undelivered'];
  const { message } = instance;
  // 1 sec per page of message
  const timeToSend = Math.ceil(message.length / 160) * 1000;
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  setTimeout(async () => {
    await instance.update({ status });
  }, timeToSend);
}

export default sendMessage;
