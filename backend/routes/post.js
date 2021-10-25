const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const postCtrl = require("../controllers/post");

router.get("/", auth, postCtrl.getAllPosts);
router.post("/", auth, multer, postCtrl.createPost);
router.put("/:id", auth, multer, postCtrl.updateOnePost);
router.delete("/:id", auth, postCtrl.deleteOnePost);
router.get("/:id/comments", auth, postCtrl.getAllCommentsOfAPost);

module.exports = router;
