const express = require("express");
const router = express.Router();

// const auth = require("../middleware/auth");
const postCtrl = require("../controllers/post");

router.get("/", postCtrl.getAllPosts);
router.post("/", postCtrl.createPost);
router.put("/:id", postCtrl.updateOnePost);
router.delete("/:id", postCtrl.deleteOnePost);

module.exports = router;
