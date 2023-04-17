class NodeError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class ValidationError extends NodeError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class NotFoundError extends NodeError {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

class DuplicateEmailError extends NodeError {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

class UnauthorizedError extends NodeError {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

module.exports = {
  NodeError,
  ValidationError,
  NotFoundError,
  DuplicateEmailError,
  UnauthorizedError,
};