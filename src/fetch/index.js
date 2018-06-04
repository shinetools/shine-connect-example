import qs from 'qs';

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

const parseJSON = response => response.json();

export default (...args) => {
  const options = args[1];
  let uri = args[0];
  if (options && options.qs) {
    uri = `${uri}?${qs.stringify(options.qs)}`;
  }
  return fetch(uri, ...args.slice(1))
    .then(checkStatus)
    .then(parseJSON);
};
