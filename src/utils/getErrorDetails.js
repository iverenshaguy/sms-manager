/**
 * @function getErrorDetails
 *
 * @param {object} details error details
 *
 * @returns {object} error object
*/
function getErrorDetails(details) {
  const mappedDetails = {};

  for (let i = 0; i < details.length; i += 1) {
    const path = details[i].path[0];
    const { message } = details[i];
    const pathDetails = mappedDetails[path];

    if (!pathDetails) {
      mappedDetails[path] = [message];
    } else {
      pathDetails.push(message);
    }
  }
  return mappedDetails;
}

export default getErrorDetails;
