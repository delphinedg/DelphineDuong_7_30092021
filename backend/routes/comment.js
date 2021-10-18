const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const commentCtrl = require("../controllers/comment");

router.post("/", auth, commentCtrl.createComment);
router.put("/:id", auth, commentCtrl.updateOneComment);
router.delete("/:id", auth, commentCtrl.deleteOneComment);

module.exports = router;
