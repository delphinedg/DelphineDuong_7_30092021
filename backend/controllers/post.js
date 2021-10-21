const db = require("../config/config-db");
const fs = require("fs");

exports.getAllPosts = (req, res, next) => {
  db.promise()
    .query(
      "SELECT u.first_name, u.last_name, u.is_admin, p.id, p.id_user, DATE_FORMAT(p.date_post, '%D %M %Y, %H:%i:%s') AS 'date_post', p.text_post, p.image_url FROM users u JOIN posts p ON u.id = p.id_user ORDER BY date_post DESC"
    )
    .then(([posts]) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

exports.createPost = (req, res, next) => {
  if (!req.body) {
    res.status(400).json({ message: "Vide" });
  } else {
    const userId = req.body.userId;
    const textPost = req.body.textPost;
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : "";
    db.promise()
      .query("INSERT INTO posts VALUES (NULL, ?, NULL, ?, ?)", [
        userId,
        textPost,
        imageUrl,
      ])
      .then(() => res.status(201).json({ message: "Publication créée" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.updateOnePost = (req, res, next) => {
  if (!req.body) {
    res.status(400).json({ message: "Vide" });
  } else {
    const postId = req.params.id;
    const textPost = req.body.textPost;
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : req.body.image;
    db.promise()
      .query("UPDATE posts SET text_post = ?, image_url = ? WHERE id = ?", [
        textPost,
        imageUrl,
        postId,
      ])
      .then(() => res.status(201).json({ message: "Publication modifiée" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.deleteOnePost = (req, res, next) => {
  const id = req.params.id;
  db.promise()
    .query("SELECT * FROM posts WHERE id = ?", [id])
    .then(([post]) => {
      const filename = post[0].image_url.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        db.promise()
          .query("DELETE FROM posts WHERE id = ? LIMIT 1", [id])
          .then(() => res.status(200).json({ message: "Pulication supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllCommentsOfAPost = (req, res, next) => {
  const id = req.params.id;
  db.promise()
    .query(
      "SELECT c.id, c.id_post, DATE_FORMAT(c.date_comment, '%D %M %Y, %H:%i:%s') AS 'date_comment', c.text_comment, c.id_user_comment, u.first_name, u.last_name, u.is_admin FROM posts p JOIN comments c ON p.id = c.id_post JOIN users u ON c.id_user_comment = u.id WHERE p.id = ? ORDER BY date_comment",
      [id]
    )
    .then(([posts]) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};
