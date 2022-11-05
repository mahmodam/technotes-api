// npm i dotenv
require("dotenv").config();

// npm i express-async-errors
// מוסיפים את הפונקציה של ה express-async-errors בקובץ server.js
// והוא יעשה את אותו דבר בכל מקום במקום asyncHandler
//require('express-async-errors');

const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
// npm i cookie-parser
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConnection");
const mongoose = require("mongoose");
const port = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.use("/auth", require("./routes/authRoutes"));

app.use("/users", require("./routes/userRoutes"));

app.use("/notes", require("./routes/notesRoutes"));

app.all("*", function (req, res) {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not found" });
  } else {
    res.type("txt").send("404 Not found");
  }
});

app.use(errorHandler);

// לא חייב
// אפשר להשאיר את ה app.listen בלי כל השאר
// אבל הוא יפעיל את השרת לפני שה mongo יתחבר
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});

// כדי ליצר קובץ של השגיאה בקובץ logs
// שגיאת התחברות למסד הנתונים
// לא חייב
mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrorLog.log"
  );
});
