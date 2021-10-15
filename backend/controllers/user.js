const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/config-db");

exports.signup = (req, res, next) => {
  //console.log(req.body);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const email = req.body.email;
      const password = hash;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      db.promise()
        .query(
          "INSERT INTO users(id, first_name, last_name, email, password) VALUES (NULL, ?, ?, ?, ?)",
          [firstName, lastName, email, password]
        )
        .then(() => res.status(201).json({ message: "Utilisateur créé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  db.promise()
    .query("SELECT * FROM users WHERE email = ?", [email])
    .then(([user]) => {
      if (user.length !== 1) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(password, user[0].password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user[0].id,
            token: jwt.sign({ userId: user[0].id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneUser = (req, res, next) => {
  const id = req.params.id;
  db.promise()
    .query("SELECT * FROM users WHERE users.id = ?", [id])
    .then(([user]) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneUserPosts = (req, res, next) => {
  const id = req.params.id;
  db.promise()
    .query(
      "SELECT * FROM users u JOIN posts p ON u.id = p.id_user WHERE u.id = ? ORDER BY date_post DESC",
      [id]
    )
    .then(([userPosts]) => res.status(200).json(userPosts))
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteOneUser = (req, res, next) => {
  const id = req.params.id;
  db.promise()
    .query("DELETE FROM users WHERE id = ? LIMIT 1", [id])
    .then(() => res.status(200).json({ message: "Utilisateur supprimé" }))
    .catch((error) => res.status(404).json({ error }));
};
