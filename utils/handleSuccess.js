// utils / handleSuccess.js

function handleSuccess(res, data, message, statusCode) {
  res.status(statusCode || 200).json({
    statusCode: statusCode || 200,
    status: "success",
    message,
    data,
  });
}

module.exports = handleSuccess;
