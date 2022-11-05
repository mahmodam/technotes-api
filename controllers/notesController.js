const User = require("../models/User");
const Note = require("../models/Note");
// npm i express-async-handler
const asyncHandler = require("express-async-handler");

// asyncHandler במקום async כדי שאם יש שגיאה תגיע לקוד שלנו ולא תגיע לקוד של המשתמש והו ידאג לשגיאות אחרות אם יש
// אפשר להחליף אותו ב express-async-errors בקובץ server.js והוא יעשה את אותו דבר בכל מקום
// להחזיר את כולם ל async ולהוסיף את הפונקציה של ה express-async-errors בקובץ server.js
// npm uninstall express-async-handler יחזיר את כולם ל async
// עדיף לשנות אותו אבל אפשר גם להשאיר
const getAllNotes = asyncHandler(async (req, res) => {
  // Get all notes from mongodb
  const notes = await Note.find().lean();
  // if no notes
  if (!notes?.length) {
    return res.status(404).json({ message: "No notes found" });
  }

  // Add username to each note before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean();
      return { ...note, username: user.username };
    })
  );

  res.status(200).json(notesWithUser);
});

// asyncHandler במקום async כדי שאם יש שגיאה תגיע לקוד שלנו ולא תגיע לקוד של המשתמש והו ידאג לשגיאות אחרות אם יש
const createNewNote = asyncHandler(async (req, res) => {
  const { title, user, text } = req.body;
  // Confirm data
  if (!title || !user || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Check for duplicate title
  // .collation({locale: 'en', strength: 2}) - case insensitive אם השם כבר קיים והקלטה היא גם קטנה וגם גדולה
  // strength: 2 כלול את כל האותיות גם קטנות וגם גדולות
  // locale: 'en' - אנגלית יש להגדיר את השפה כדי שהאותיות יהיו גם קטנות וגם גדולות
  const doblicateNote = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (doblicateNote) {
    return res.status(400).json({ message: "Note already exists" });
  }
  // Create and store the new note
  const note = await Note.create({ title, user, text });
  if (note) {
    res.status(201).json(note);
  } else {
    res.status(400).json({ message: "Invalid note data" });
  }
});

// asyncHandler במקום async כדי שאם יש שגיאה תגיע לקוד שלנו ולא תגיע לקוד של המשתמש והו ידאג לשגיאות אחרות אם יש
const updateNote = asyncHandler(async (req, res) => {
  const { id, title, user, text, completed } = req.body;

  // Confirm data
  if (!id || !title || !user || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Confirm note exists to update
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  // check for doblicate title
  // .collation({locale: 'en', strength: 2}) - case insensitive אם השם כבר קיים והקלטה היא גם קטנה וגם גדולה
  // strength: 2 כלול את כל האותיות גם קטנות וגם גדולות
  // locale: 'en' - אנגלית יש להגדיר את השפה כדי שהאותיות יהיו גם קטנות וגם גדולות
  const doblicateNote = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  // Allow updates to the original note
  if (doblicateNote && doblicateNote._id.toString() !== id) {
    return res.status(400).json({ message: "Note already exists" });
  }

  note.title = title;
  note.user = user;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();
  res.status(200).json(updatedNote);
});

// asyncHandler במקום async כדי שאם יש שגיאה תגיע לקוד שלנו ולא תגיע לקוד של המשתמש והו ידאג לשגיאות אחרות אם יש
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Confirm note exists to delete
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  await note.remove();
  res.status(200).json({ message: "Note removed" });
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
