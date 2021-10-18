const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const postCtrl = require("../controllers/post");

router.get("/", auth, postCtrl.getAllPosts);
router.post("/", auth, multer, postCtrl.createPost);
router.put("/:id", postCtrl.updateOnePost);
router.delete("/:id", postCtrl.deleteOnePost);
router.get("/:id/comments", postCtrl.getAllCommentsOfAPost);

module.exports = router;
