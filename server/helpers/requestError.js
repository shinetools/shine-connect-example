class RequestError extends Error {
  constructor(body, status) {
    super();
    this.body = body;
    this.status = status;
  }
}

module.exports = RequestError;
