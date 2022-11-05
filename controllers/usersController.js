const User = require("../models/User");
const Note = require("../models/Note");
// npm i express-async-handler
const asyncHandler = require("express-async-handler");
// npm i bcrypt
// להצפנת הסיסמאות
const bcrypt = require("bcrypt");

// asyncHandler במקום async כדי שאם יש שגיאה תגיע לקוד שלנו ולא תגיע לקוד של המשתמש והו ידאג לשגיאות אחרות אם יש
// אפשר להחליף אותו ב express-async-errors בקובץ server.js והוא יעשה את אותו דבר בכל מקום
// להחזיר את כולם ל async ולהוסיף את הפונקציה של ה express-async-errors בקובץ server.js
// npm uninstall express-async-handler יחזיר את כולם ל async
// עדיף לשנות אותו אבל אפשר גם להשאיר
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(404).json({ message: "No users found" });
  }
  res.status(200).json(users);
});

// asyncHandler במקום async כדי שאם יש שגיאה תגיע לקוד שלנו ולא תגיע לקוד של המשתמש והו ידאג לשגיאות אחרות אם יש
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password || !Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // .collation({locale: 'en', strength: 2}) - case insensitive אם השם כבר קיים והקלטה היא גם קטנה וגם גדולה
  // strength: 2 כלול את כל האותיות גם קטנות וגם גדולות
  // locale: 'en' - אנגלית יש להגדיר את השפה כדי שהאותיות יהיו גם קטנות וגם גדולות
  const doblicateUser = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (doblicateUser) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ username, password: hashedPassword, roles });

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// asyncHandler במקום async כדי שאם יש שגיאה תגיע לקוד שלנו ולא תגיע לקוד של המשתמש והו ידאג לשגיאות אחרות אם יש
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    roles.length === 0 ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).lean().exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // check for doblicate username
  // .collation({locale: 'en', strength: 2}) - case insensitive אם השם כבר קיים והקלטה היא גם קטנה וגם גדולה
  // strength: 2 כלול את כל האותיות גם קטנות וגם גדולות
  // locale: 'en' - אנגלית יש להגדיר את השפה כדי שהאותיות יהיו גם קטנות וגם גדולות
  const doblicateUser = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  // Allow updates to the original user
  if (doblicateUser && doblicateUser._id.toString() !== id) {
    return res.status(400).json({ message: "Username already exists" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  // password update
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.save(user);

  res.status(200).json(updatedUser);
});

// asyncHandler במקום async כדי שאם יש שגיאה תגיע לקוד שלנו ולא תגיע לקוד של המשתמש והו ידאג לשגיאות אחרות אם יש
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const notes = await Note.find({ user: id }).lean().exec();
  if (notes?.length > 0) {
    return res.status(400).json({ message: "Cannot delete user with notes" });
  }

  const user = await User.findById(id).lean().exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await User.deleteOne();

  res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
