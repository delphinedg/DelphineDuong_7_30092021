const db = require("../config/config-db");

exports.getAllPosts = (req, res, next) => {
  db.promise()
    .query("SELECT * FROM posts ORDER BY date_post ASC")
    .then(([posts]) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.createPost = (req, res, next) => {
  const idUser = req.body.idUser;
  const textPost = req.body.textPost;
  const imageUrl = req.body.imageUrl;
  db.promise()
    .query("INSERT INTO posts VALUES (NULL, ?, NULL, ?, ?)", [
      idUser,
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

// A REVOIR
exports.getAllPostsOfUser = (req, res, next) => {
  const idUser = req.body.idUser;
  db.promise()
    .query(
      "SELECT * FROM posts JOIN users ON posts.id_user = users.id WHERE users.id = ?",
      [idUser]
    )
    .then(([posts]) => {
      res.status(200).json(posts);
      console.log(posts);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
