const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/post");

router.get("/", postCtrl.getAllPosts);
router.post("/", postCtrl.createPost);
router.put("/:id", postCtrl.updateOnePost);
router.delete("/:id", postCtrl.deleteOnePost);
router.get("/:idUser", postCtrl.getAllPostsOfUser);

module.exports = router;
