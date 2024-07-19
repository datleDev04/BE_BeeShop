class ApiError extends Error {
  constructor(statusCode, errors) {
    super(errors.message || 'An error occurred');

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      errors: this.errors,
      stack: this.stack,
    };
  }
}

export default ApiError;
