const db = require("../config/config-db");

// Fonction pour créer un commentaire.
// On définit des constantes pour récupérer les valeurs de la requête. On fait un INSERT INTO pour insérer les valeurs dans la table "comments". Si tout se passe bien, on envoie un status 201 (created), si non on envoie un status 400 (bad request).
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

// Fonction pour modifier un commentaire.
// On définit des constantes pour récupérer les valeurs de la requête. On fait un UPDATE pour modifier la valeur du champ text_comment du commentaire correspondant (defini par l'id).
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

// Fonction pour supprimer un commentaire.
// On fait un DELETE FROM pour supprimer le commentaire (defini par l'id) de la table "comments" et on met une limite à 1 pour supprimer une seule ligne.
exports.deleteOneComment = (req, res, next) => {
  const id = req.params.id;
  db.promise()
    .query("DELETE FROM comments WHERE id = ? LIMIT 1", [id])
    .then(() => res.status(200).json({ message: "Commentaire supprimé" }))
    .catch((error) => res.status(400).json({ error }));
};
