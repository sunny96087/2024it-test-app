// utils / handleError.js

function handleError(res, message, statusCode) {
  res.status(statusCode || 500).json({
    status: "false",
    message: message || "Sorry, server error...",
  });
}

module.exports = handleError;
