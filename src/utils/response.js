export const SuccessResponse = (res, statusCode, message, metaData) => {
  res.status(statusCode).json({
    message: message,
    statusCode: statusCode,
    metaData: metaData,
  });
};
