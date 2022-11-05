const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");

// כדי שיהיה token בכל בקשה נצרף לכל בקשה בכותרת
// Authorization: Bearer <token>
// ככה נקבל טוקל בכל הבקשות למטה
router.use(verifyJWT);

router
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
