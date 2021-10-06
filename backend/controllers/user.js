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
      const first_name = req.body.first_name;
      const last_name = req.body.last_name;
      db.promise()
        .query("INSERT INTO users VALUES (NULL, ?, ?, ?, ?, 0)", [
          first_name,
          last_name,
          email,
          password,
        ])
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
    .query("SELECT * FROM users WHERE id = ?", [id])
    .then(([user]) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteOneUser = (req, res, next) => {
  const id = req.params.id;
  db.promise()
    .query("DELETE FROM users WHERE id = ? LIMIT 1", [id])
    .then(() => res.status(200).json({ message: "Utilisateur supprimé" }))
    .catch((error) => res.status(404).json({ error }));
};
