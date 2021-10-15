const db = require("../config/config-db");

exports.getAllPosts = (req, res, next) => {
  db.promise()
    .query(
      "SELECT * FROM users u JOIN posts p ON u.id = p.id_user ORDER BY date_post DESC"
    )
    .then(([posts]) => res.status(200).json([posts]))
    .catch((error) => res.status(400).json({ error }));
};

exports.createPost = (req, res, next) => {
  const userId = req.body.userId;
  const textPost = req.body.textPost;
  const imageUrl = req.body.imageUrl;
  db.promise()
    .query("INSERT INTO posts VALUES (NULL, ?, NULL, ?, ?)", [
      userId,
      textPost,
      imageUrl,
    ])
    .then(() => res.status(201).json({ message: "Publication créée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.updateOnePost = (req, res, next) => {
  const textPost = req.body.textPost;
  const imageUrl = req.body.imageUrl;
  const id = req.params.id;
  db.promise()
    .query("UPDATE posts SET text_post = ?, image_url = ? WHERE id = ?", [
      textPost,
      imageUrl,
      id,
    ])
    .then(() => res.status(201).json({ message: "Publication modifiée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteOnePost = (req, res, next) => {
  const id = req.params.id;
  db.promise()
    .query("DELETE FROM posts WHERE id = ? LIMIT 1", [id])
    .then(() => res.status(200).json({ message: "Pulication supprimée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllCommentsOfAPost = (req, res, next) => {
  const idPost = req.params.id;
  db.promise()
    .query(
      "SELECT * FROM posts p JOIN comments c ON p.id = c.id_post JOIN users u ON c.id_user_comment = u.id WHERE p.id = ? ORDER BY date_comment",
      [idPost]
    )
    .then(([posts]) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};
