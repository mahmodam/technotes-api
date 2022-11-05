// קובץ שייך ל cors cors
// ומגדיר את האוריגינים המותרים
// לא חובה

const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: function (origin, callback) {
    // -1 כדי לוודא שהוא קיים במערך של allowedOrigins
    // !origin כדי לאפשר לדברים אחרים כמו postman להתחבר
    // !origin מתי שמסיימים את הכל צריך להסיר אותו כדי לא לאפשר לכל אחד להתחבר
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // כדי לאפשר לשלוח קוקייס
  optionsSuccessStatus: 200, // כדי לאפשר לשלוח קוקייס
};

module.exports = corsOptions;
