const express = require("express");
const router = express.Router();

const commentCtrl = require("../controllers/comment");

router.post("/", commentCtrl.createComment);
router.put("/:id", commentCtrl.updateOneComment);
router.delete("/:id", commentCtrl.deleteOneComment);

module.exports = router;
