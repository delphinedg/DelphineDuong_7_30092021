<template>
  <div class="profile-page">
    <Nav/>
    <div class="profile">
      <div class="profile-card">
        <div class="profile-card__image">
          <img src="../assets/profile-img.png" alt="avatar utilisateur"/>
        </div>
        <h1 class="profile-card__name">{{ userProfile.first_name }} {{ userProfile.last_name }}</h1>
        <p class="profile-card__email">{{ userProfile.email }}</p>
        <button class="btn" @click="deleteAccount()" v-if="isUserOrAdmin">Supprimer mon compte</button>
      </div>
    </div>
    <div class="all-posts" :key="index" v-for="(post, index) in userPosts">
      <div class="card">
        <div class="card-post">
          <p class="card-post__name"><a :href="$router.resolve({ name: 'Profile', params: { id: post.id_user }}).href">{{ post.first_name }} {{ post.last_name }}</a></p>
          <p class="card-post__date">{{ post.date_post }}</p>
          <p class="card-post__content" v-if='post.text_post !=""'>{{ post.text_post }}</p>
          <div class="card-post__image" v-if='post.image_url !=""'><img :src="post.image_url"/></div>
        </div>
        <hr>
        <button class="btn btn--outlined" @click="deletePost(post.id)" v-if="isPostAuthorOrAdmin(post)">Supprimer la publication</button>
        <hr>
        <div class="card-comment" :key="i" v-for="(comment, i) in post.comments">
          <p class="card-comment__name"><a :href="$router.resolve({ name: 'Profile', params: { id: comment.id_user_comment }}).href">{{ comment.first_name }} {{ comment.last_name }}</a></p>
          <p class="card-comment__date">{{ comment.date_comment }}</p>
          <p class="card-comment__content">{{ comment.text_comment }}</p>
          <button class="btn btn--outlined" v-if="isCommentAuthorOrAdmin(comment)" @click="deleteComment(comment.id)">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from '../components/Nav.vue'

const axios = require("axios");
const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default {
  name: 'Profile',
  components: {
    Nav
  },
  data: function() {
    return {
      userStore: this.$store.state.user,
      userProfile: [],
      userPosts: [],
    }
  },
  computed: {
    isUserOrAdmin: function() {
      // On regarde si l'userId de la personne connectée correspond à l'userId du profil ou si elle est admin. Si oui, on retourne true, si non, false.
      if (this.userProfile.id == this.userStore.userId) {
        return true;
      } else if (this.userStore.isAdmin == 1) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    deleteAccount: function() {
      // Requête delete pour supprimer le compte de l'utilisateur. Une fois supprimé de la base de données, on le déconnecte et on le renvoie vers la page de connexion.
      const self = this;
      if (confirm("Etes-vous sûr de vouloir supprimer votre compte ? Vous ne pourrez plus accéder au réseau social Groupomania.")) {
        instance.delete("/auth/" + this.$route.params.id)
        .then(function() {
          self.$store.commit('logout');
          self.$router.push('/');
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    },
    getPostsAndComments: function() {
      const self = this;
      instance.get("/auth/" + this.$route.params.id + "/posts")
      .then(function (response) {
        self.userPosts = response.data;
        for (let i = 0; i < self.userPosts.length; i++) {
          instance.get("/posts/" + self.userPosts[i].id + "/comments")
            .then(function (response) {
              self.$set(self.userPosts, i, {...self.userPosts[i], comments: response.data});
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    isPostAuthorOrAdmin: function(post) {
      if (this.userStore.userId == post.id_user) {
        return true;
      } else if (this.userStore.isAdmin == 1) {
        return true;
      } else {
        return false;
      }
    },
    isCommentAuthorOrAdmin: function(comment) {
      if (this.userStore.userId == comment.id_user_comment) {
        return true;
      } else if (this.userStore.isAdmin == 1) {
        return true;
      } else {
        return false;
      }
    },
    deletePost: function(postId) {      
      if (confirm("Etes-vous sûr de vouloir supprimer cette publication ?")) {
        instance.delete("/posts/" + postId, {
          headers: {
          Authorization: 'Bearer ' + this.userStore.token,
          }
        }).then(() => {
          this.getAllPostsAndComments();
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    },
    deleteComment: function(commentId) {
    if (confirm("Etes-vous sûr de vouloir supprimer ce commentaire ?")) {
      instance.delete("/comments/" + commentId, {
        headers: {
        Authorization: 'Bearer ' + this.userStore.token,
        }
      })
        .then(() => {
          this.getAllPostsAndComments();
        })
        .catch(function(error) {
          console.log(error);
        }); 
      }
    },
  },
  mounted: function() {
    const self = this;
    // Si le user n'est pas connecté et essaye d'accéder à la page, on fait un retour vers la page de connexion.
    if (this.userStore.userId == -1) {
      this.$router.push('/');
      return;
    }
    // Requête get pour récupérer les informations du user.
    instance.get("/auth/" + this.$route.params.id)
    .then(function (response) {
      self.userProfile = response.data[0];
    })
    .catch(function (error) {
      console.log(error);
    });
    this.getPostsAndComments();
  }
}
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-card {
  padding: 30px;
  &__image img {
    width: 30%;
  }
}
</style>
