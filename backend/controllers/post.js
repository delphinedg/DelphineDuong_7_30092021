const db = require("../config/config-db");

exports.getAllPosts = (req, res, next) => {
  db.promise()
    .query(
      "SELECT u.first_name AS postAuthorFirstName, u.last_name AS postAuthorLastName, p.date_post AS datePost, p.text_post AS textPost, p.image_url AS imageUrl, c.date_comment AS dateComment, c.text_comment AS textComment, u2.first_name AS commentAuthorFirstName, u2.last_name AS commentAuthorLastName FROM users u JOIN posts p ON u.id = p.id_user LEFT JOIN comments c ON c.id_post = p.id LEFT JOIN users u2 ON c.id_user_comment = u2.id ORDER BY date_post DESC, date_comment"
    )
    .then(([posts]) => res.status(200).json(posts))
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
