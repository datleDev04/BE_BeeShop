export const SuccessResponse = (res, statusCode, message, metaData, other) => {
  res.status(statusCode).json({
    message: message,
    statusCode: statusCode,
    metaData: metaData,
    ...other
  });
};
