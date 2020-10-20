module.exports = function jsonResponseFormat(req, res, next) {
  res.jsonResponseFormat = (status, err, data) => {
    res.status(status).json({ status, err, data });
  };
  next();
};
