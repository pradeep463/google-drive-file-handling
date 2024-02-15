let handleError = (err) => {
  if (process.env.MODE !== "PRODUCTION") {
    console.log(err);
  }

  if (err.name === "UnauthorizedError") {
    return {
      status_code: 401,
      message: "Invalid token",
    };
  }

  // Check if there is a duplicate key error.
  // MongoDb error.
  if (err.code == 11000) {
    return {
      status_code: 409,
      message: "Duplicate Key error.",
    };
  }

  // Default case.
  return {
    status_code: err.status_code || 500,
    message: err.message || "Internal server error.",
  };
};

module.exports = {
  handleError,
};
