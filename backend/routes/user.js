const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/:id", userCtrl.getOneUser);
router.delete("/:id", userCtrl.deleteOneUser);
router.get("/:id/posts", userCtrl.getOneUserPosts);

module.exports = router;
