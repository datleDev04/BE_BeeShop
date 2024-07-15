export const SuccessResponse = (res, statusCode, message, metaData = null) => {
  const response = {
    message: message,
    statusCode: statusCode,
  };

  if (metaData) {
    response.metaData = metaData;
  }

  res.status(statusCode).json(response);
};
