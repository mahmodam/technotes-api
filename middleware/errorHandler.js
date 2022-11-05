const { logEvents } = require("./logger");

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${res.uuid}`,
    "error.log"
  );
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500;

  res.status(status).send("Something went wrong");

  // אם משנים express-async-handler ל express-async-errors
  // אז יש לשנות אותה שורה ל
  // res.json({message: err.message, isError: true});
  res.json({ message: err.message });
};

module.exports = errorHandler;
