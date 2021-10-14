<template>
  <div class="profile-page">
    <Nav/>
    
    <div class="profile">
      <div class="profile-card">
        <div class="profile-card__image">
          <img src="../assets/profile-img.png" alt="avatar utilisateur"/>
        </div>
        <h1 class="profile-card__name">Nom prénom</h1>
        <p class="profile-card__email">Email</p>
        <button class="btn btn--post">Supprimer mon compte</button>
      </div>
    </div>
    <div class="all-posts">
      <div class="card">
        <div class="card-post">
          <p class="card-post__name"><a href="#">Prénom Nom</a></p>
          <p class="card-post__date">Date</p>
          <p class="card-post__content">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
          <div class="card-post__image"><img src="../assets/welcome.jpg"/></div>
        </div>
        <hr>
        <div class="card-comment">
          <p class="card-comment__name"><a href="#">Nom prénom</a></p>
          <p class="card-comment__date">Date</p>
          <p class="card-comment__content">Texte du commentaire ici</p>
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
  name: 'Profile',
  components: {
    Nav
  },
}
</script>

<style scoped lang="scss">
.profile-card {
  padding: 30px;
  &__image img {
    width: 30%;
  }
}
</style>
