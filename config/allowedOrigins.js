// קובץ ששיך ל cors ומגדיר את האוריגינים המותרים
// לא חובה
// localhost:3000 כדי לאפשר ל react לשלוח בקשות לשרת
// 'http://localhost:3000' לא צריך יותר אותו כדי שלא יוכלו לגשת אליו
//  'https://technotes-1bga.onrender.com' שם האתר שלנו שהעליתי ל render
const allowedOrigins = [
  "https://technotes-1bga.onrender.com",
  "http://localhost:3000",
];

module.exports = allowedOrigins;
