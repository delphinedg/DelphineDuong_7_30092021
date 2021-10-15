<template>
  <div class="posts-page">
    <Nav/>
    <h1>Toutes les publications</h1>
    <div class="create-post">
      <div class="card">
        <textarea cols="100" rows="4" placeholder="Ecrivez quelque chose..."></textarea>
        <input type="file" id="input_image" accept="image/gif, image/jpeg, image/jpg, image/png"/>
        <button class="btn btn--outlined btn--post">Publier</button>
      </div>
    </div>
    <div class="all-posts">
      <div class="card">
        <div class="card-post">
          <p class="card-post__name"><a href="#">Prénom Nom</a></p>
          <p class="card-post__date">Date</p>
          <p class="card-post__content">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
          <div class="card-post__image"><img src="../assets/welcome.jpg"/></div>
        </div>
        <div class="btn-post">
          <button class="btn-post__update">Modifier</button>
          <button class="btn-post__delete">Supprimer</button>
        </div>
        <hr>
        <div class="card-comment">
          <p class="card-comment__name"><a href="#">Nom prénom</a></p>
          <p class="card-comment__date">Date</p>
          <p class="card-comment__content">Texte du commentaire ici</p>
          <div class="btn-post">
            <button class="btn-post__update">Modifier</button>
            <button class="btn-post__delete">Supprimer</button>
          </div>
        </div>
        <div class="add-comments">
          <textarea id="write-comment" cols="100" rows="1" placeholder="Ecrivez un commentaire..."></textarea>
          <button class="btn btn--outlined btn--post">Commenter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from '../components/Nav.vue'

export default {
  name: 'Login',
  components: {
    Nav
  },
}
</script>

<style scoped lang="scss">
h1 {
  padding: 20px 0;
}
</style>
