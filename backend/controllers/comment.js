const db = require("../config/config-db");

exports.createComment = (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.body.userId;
  const textComment = req.body.textComment;
  db.promise()
    .query("INSERT INTO comments VALUES (NULL, ?, ?, NULL, ?)", [
      postId,
      userId,
      textComment,
    ])
    .then(() => res.status(201).json({ message: "Commentaire créé" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.updateOneComment = (req, res, next) => {
  const textComment = req.body.textComment;
  const id = req.params.id;
  db.promise()
    .query("UPDATE comments SET text_comment = ? WHERE id = ?", [
      textComment,
      id,
    ])
    .then(() => res.status(201).json({ message: "Commentaire modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteOneComment = (req, res, next) => {
  const id = req.params.id;
  db.promise()
    .query("DELETE FROM comments WHERE id = ? LIMIT 1", [id])
    .then(() => res.status(200).json({ message: "Commentaire supprimé" }))
    .catch((error) => res.status(400).json({ error }));
};
