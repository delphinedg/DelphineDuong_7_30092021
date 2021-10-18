<template>
  <div class="posts-page">
    <Nav/>
    <h1>Votre fil d'actualité</h1>
    <!-- Créer une publication -->
    <div class="create-post">
      <div class="create-post__title">
          <p>Créer une publication</p>
      </div>
      <form class="card" @submit.prevent="createPost()" enctype="multipart/form-data">
        <textarea v-model="textPost" name="textPost" cols="100" rows="4" placeholder="Ecrivez quelque chose..."></textarea>
        <input type="file" name="image" accept="image/gif, image/jpeg, image/jpg, image/png" @change="onFileUpload"/>
        <button class="btn btn--outlined btn--post">Publier</button>
      </form>
    </div>
    <!-- Afficher toutes les publications -->
    <div class="all-posts" :key="index" v-for="(post, index) in posts">
      <div class="card">
        <div class="card-post">
          <p class="card-post__name"><router-link :to="{ name: 'Profile', params: { id: post.id_user }}">{{ post.first_name }} {{ post.last_name }}</router-link></p>
          <p class="card-post__date">{{ post.date_post }}</p>
          <p class="card-post__content" v-if='post.text_post !=""'>{{ post.text_post }}</p>
          <div class="card-post__image" v-if='post.image_url !=""'><img :src="post.image_url"/></div>
        </div>
        <button class="btn-post__delete" @click="deletePost(post.id)" v-if="isPostAuthorOrAdmin(post)">Supprimer</button>
        <hr>
        <!-- Afficher tous les commentaires de la publication correspondante -->
        <div class="card-comment" :key="i" v-for="(comment, i) in post.comments">
          <p class="card-comment__name"><a href="#">{{ comment.first_name }} {{ comment.last_name }}</a></p>
          <p class="card-comment__date">{{ comment.date_comment }}</p>
          <p class="card-comment__content">{{ comment.text_comment }}</p>
          <button class="btn-post__delete" @click="deleteComment(comment.id)" v-if="isCommentAuthorOrAdmin(comment)">Supprimer</button>
        </div>
        <!-- Ajouter un commentaire à la publication correspondante -->
        <div class="add-comments">
          <textarea v-model="textComment[index]" id="write-comment" cols="100" rows="1" placeholder="Ecrivez un commentaire..."></textarea>
          <button class="btn btn--outlined btn--post" @click="createComment(post.id, index)">Commenter</button>
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
  name: 'Login',
  components: {
    Nav
  },
  data: function() {
    return {
      userStore: this.$store.state.user,
      posts: [],
      textPost: "",
      image: null,
      textComment: [],
    }
  },
  computed: {
  },
  methods: {
    getAllPostsAndComments: function() {
      const self = this;
      instance.get("/posts", {
        headers: {
        Authorization: 'Bearer ' + this.userStore.token,
        }
      })
      .then(function (response) {
        self.posts = response.data;
        for (let i = 0; i < self.posts.length; i++) {
          instance.get("/posts/" + self.posts[i].id + "/comments", {
            headers: {
            Authorization: 'Bearer ' + self.userStore.token,
            }
          }).then(function (response) {
              self.$set(self.posts, i, {...self.posts[i], comments: response.data});
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
    onFileUpload: function(event) {
      this.image = event.target.files[0];
      // console.log(this.image);
    },
    createPost: function() {
      // On crée le l'objet javascript form data
      const formData = new FormData();
      // On ajoute les données que l'on souhaite dans le form data. S'il y a une image, on récupère le texte, l'image et l'userId. Si non, on récupère le texte et l'userId.
      if (this.image != null) {
        formData.append('textPost', this.textPost);
        formData.append('image', this.image, this.image.name);
        formData.append('userId', this.userStore.userId);
      } else {
        formData.append('textPost', this.textPost);
        formData.append('userId', this.userStore.userId);
      }
      //console.log(Array.from(formData));

      // Requête POST pour envoyer le form data à l'API
      instance.post("/posts", formData, {
        headers: {
        Authorization: 'Bearer ' + this.userStore.token,
        }
      }).then((res) => {
        console.log(res);
        this.getAllPostsAndComments();
        this.textPost = "";
        this.image = null;
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    deletePost: function(postId) {      
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
    },
    createComment: function(postId, index) {
      instance.post("/comments", {
        postId: postId,
        userId: this.userStore.userId,
        textComment: this.textComment[index],
      },{
        headers: {
        Authorization: 'Bearer ' + this.userStore.token,
        }
      }).then(() => {
        this.getAllPostsAndComments();
        this.textComment = [];
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    deleteComment: function(commentId) {
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
    },
  },
  mounted: function() {
    // Si le user n'est pas connecté et essaye d'accéder à la page, on fait un retour vers la page de connexion.
    if (this.userStore.userId == -1) {
      this.$router.push('/');
      return;
    }
    // On fait appel à la méthode getAllPostsAndComments pour afficher les publications et les commentaires de la base de données.
    this.getAllPostsAndComments();
  }
}
</script>

<style scoped lang="scss">
h1 {
  padding: 20px 0;
}
</style>
