const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/config-db");

// Fonction pour enregistrer un nouveau utilisateur dans la base de données.
// On définit des REGEX pour sécuriser les champs nom, prénom, email et mot de passe. Si un des champs retourne false, on envoie une erreur.
// Si non, on utilise la méthode hash() de bcrypt pour hacher et saler 10 fois le mot de passe - en cas d'erreur, on envoie une erreur 500. On fait ensuite un INSERT INTO pour insérer les valeurs dans la table "users".
exports.signup = (req, res, next) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  let password = req.body.password;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex = /.{8,32}/;
  const nameRegex =
    /^[a-zA-Zéèçàêëöùä]+(([',. -][a-zA-Zéèçàêëöùä ])?[a-zA-Zéèçàêëöùä]*)*$/;
  if (
    nameRegex.test(firstName) == false ||
    nameRegex.test(lastName) == false ||
    emailRegex.test(email) == false ||
    passwordRegex.test(password) == false
  ) {
    return res.status(400).json({ error: "Informations incorrectes" });
  } else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        password = hash;
        db.promise()
          .query(
            "INSERT INTO users(id, first_name, last_name, email, password) VALUES (NULL, ?, ?, ?, ?)",
            [firstName, lastName, email, password]
          )
          .then(() => res.status(201).json({ message: "Utilisateur créé" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

// Fonction pour se connecter.
// On fait un SELECT * de la table "users" pour récupérer tous les champs de l'utilisateur correspondant à l'email de la requête. S'il n'y a pas d'utilisateur correspondant (user.length == 0) ou s'il y a plusieurs utilisateurs (user.length > 1), on retourne une erreur. Si non, on utilise la méthode compare() de bcrypt pour comparer le mot de passe de la requête au mot de passe haché et sauvegardé dans la base de données. Si le mot de passe n'est pas valide, on retourne une erreur. S'il est valide, on retourne l'userId, le token et la valeur isAdmin.
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  db.promise()
    .query("SELECT * FROM users WHERE email = ?", [email])
    .then(([user]) => {
      if (user.length !== 1) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      } else {
        bcrypt
          .compare(password, user[0].password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user[0].id,
              token: jwt.sign({ userId: user[0].id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "24h",
              }),
              isAdmin: user[0].is_admin,
            });
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// Fonction pour récupérer les données d'un utilisateur.
// On fait un SELECT * de l'utilisateur correspondant à l'id donné.
exports.getOneUser = (req, res, next) => {
  const id = req.params.id;
  db.promise()
    .query("SELECT * FROM users WHERE users.id = ?", [id])
    .then(([user]) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};

// Fonction pour supprimer un utilisateur.
// On fait un DELETE FROM pour supprimé l'utilisateur sélectionné via son id et on met une limite à 1 pour supprimer une seule ligne de la base de données.
exports.deleteOneUser = (req, res, next) => {
  const id = req.params.id;
  db.promise()
    .query("DELETE FROM users WHERE id = ? LIMIT 1", [id])
    .then(() => res.status(200).json({ message: "Utilisateur supprimé" }))
    .catch((error) => res.status(404).json({ error }));
};
