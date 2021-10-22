const db = require("../config/config-db");
const fs = require("fs");

// Fonction pour récupérer toutes les publications de la table "posts" et les utilisateurs correspondants.
// On fait un SELECT. On sélectionne les champs qui nous intéressent dans les tables "users" et "posts" (on formate le champ date_post). On fait une jointure des deux tables et on précise que les champs users.id = posts.id_user pour pouvoir les relier, puis on ordonne les publications par ordre décroissant (du plus récent au plus ancien).
exports.getAllPosts = (req, res, next) => {
  db.promise()
    .query(
      "SELECT u.first_name, u.last_name, u.is_admin, p.id, p.id_user, DATE_FORMAT(p.date_post, '%b %D %Y, %H:%i:%s') AS 'date_post', p.text_post, p.image_url FROM users u JOIN posts p ON u.id = p.id_user ORDER BY date_post DESC"
    )
    .then(([posts]) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour créer une publication.
// S'il n'y a pas de données (req.body), on envoie une erreur.
// Si non, on définit des constantes pour récupérer les données de la requête. S'il y a une image (req.file), alors on définit l'url de l'image, si non on laisse le champ vide. On fait un INSERT INTO pour insérer les valeurs dans la table "posts" de la base de données. Si tout se passe bien, on envoie un status 201 (created), si non on envoie un status 400 (bad request).
exports.createPost = (req, res, next) => {
  if (!req.body) {
    res.status(400).json({ error });
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

// Fonction pour mettre à jour une publication.
// S'il n'y a pas de données (req.body), on envoie une erreur.
// Si non, on insère les données dans les constantes (comme pour la création) et on fait une UPDATE pour modifier les valeurs des champs "text_post et image_url" de la publication correspondante (defini par postId).
exports.updateOnePost = (req, res, next) => {
  if (!req.body) {
    res.status(400).json({ error });
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

// Fonction pour supprimer une publication.
// On fait un SELECT de tous les champs de la table "posts" et on sélectionne la publication correspondante. On supprime l'image de la pubication du dossier "images", puis on fait un DELETE FROM pour supprimer la publication et on met une limite à 1 pour supprimer qu'une seule ligne par sécurité.
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

// Fonction pour récupérer tous les commentaires d'une publication.
// On fait un SELECT. On sélectionne les champs qui nous intéressent dans les tables "comments" et "users". On fait une première jointure des tables "posts" et "comments" et on précise que posts.id = comment.id_post afin de récupèrer les commentaires de la publication (variable "postId"). Puis, on fait une deuxière jointure des tables "comments" et "users" afin de récupèrer le nom des utilisateurs qui ont écrit les commentaires. Enfin, on ordonne les commentaires par ordre croissant (du plus ancien au plus récent).
exports.getAllCommentsOfAPost = (req, res, next) => {
  const postId = req.params.id;
  db.promise()
    .query(
      "SELECT c.id, c.id_post, DATE_FORMAT(c.date_comment, '%b %D %Y, %H:%i:%s') AS 'date_comment', c.text_comment, c.id_user_comment, u.first_name, u.last_name, u.is_admin FROM posts p JOIN comments c ON p.id = c.id_post JOIN users u ON c.id_user_comment = u.id WHERE p.id = ? ORDER BY date_comment",
      [postId]
    )
    .then(([posts]) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};
