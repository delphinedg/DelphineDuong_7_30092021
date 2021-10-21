<template>
  <div class="posts-page">
    <Nav/>
    <h1>Votre fil d'actualité</h1>

    <!-- DEBUT CREATION PUBLICATION -->
    <div class="create-post">
      <div class="card">
        <p class="card__title">
          Créer une publication
        </p>
        <form class="form" @submit.prevent="createPost()" enctype="multipart/form-data">
          <div class="form-group">
            <textarea v-model="textPost" name="textPost" rows="4" placeholder="Ecrivez quelque chose..."></textarea>
          </div>
          <hr>
          <div class="form-group">
            <label class="form-label">Ajoutez une image à votre publication : </label>
            <input type="file" name="image" accept="image/gif, image/jpeg, image/jpg, image/png" @change="onFileUpload"/>
            <div class="preview" v-if="url">
              <img :src="url">
            </div>
          </div>
          <hr>
          <button class="btn">Publier</button>
        </form>
      </div>
    </div>
    <!-- FIN CREATION PUBLICATION -->

    <!-- TOUTES LES PUBLICATIONS -->
    <div class="all-posts" >
      <div class="card" :key="index" v-for="(post, index) in posts">
        <!-- DEBUT PUBLICATION -->
        <div class="card-post">
          <p class="card-post__name"><router-link :to="{ name: 'Profile', params: { id: post.id_user }}">{{ post.first_name }} {{ post.last_name }}</router-link></p>
          <p class="card-post__date">{{ post.date_post }}</p>
          <div class="card-post__content">
            <input type="text" v-model="post.text_post" :id="`post-edit-${post.id}`" @keydown.enter="updatePost(post.id, post.text_post)" v-if="postEditingId == post.id && isPostAuthorOrAdmin(post)" placeholder="Ecrivez quelque chose..."/>
            <p v-else>{{ post.text_post }}</p>
          </div>
          <div class="card-post__image">
            <div v-if="post.image_url">
              <img :src="post.image_url"/>
            </div>
            <div v-if="postEditingId == post.id && isPostAuthorOrAdmin(post)">        
              <button class="btn btn--outlined" @click="deleteImage(post)" v-if="post.image_url">Supprimer l'image</button>
              <input type="file" name="image" accept="image/gif, image/jpeg, image/jpg, image/png" @change="onFileUpdate" v-else/>
              <div class="preview" v-if="urlUpdate">
                <img :src="urlUpdate">
              </div>
            </div>
          </div>
        </div>
        <!-- FIN PUBLICATION -->
        <hr>
        <!-- DEBUT BOUTONS SUPPRIMER ET MODIFIER -->
        <div class="wrapper-btn" v-if="isPostAuthorOrAdmin(post) && postEditingId == ''">
          <button class="btn btn--outlined btn-delete" @click.prevent="deletePost(post.id)">Supprimer la publication</button>
          <button class="btn btn--outlined" @click.prevent="setEditingPost(post)" >Modifier la publication</button>
        </div>
        <div class="wrapper-btn" v-if="isPostAuthorOrAdmin(post) && postEditingId == post.id">
          <button class="btn" @click.prevent="updatePost(post.id, post.text_post, post.image_url)">Enregistrer</button>
        </div>
        <!-- FIN BOUTONS SUPPRIMER ET MODIFIER -->
        <hr>
        <!-- DEBUT COMMENTAIRES -->
        <div class="card-comment" :key="index" v-for="(comment, index) in post.comments">
          <p class="card-comment__name">
            <router-link :to="{ name: 'Profile', params: { id: comment.id_user_comment }}">
              {{ comment.first_name }} {{ comment.last_name }}
            </router-link>
          </p>
          <p class="card-comment__date">{{ comment.date_comment }}</p>
          <div class="card-comment__content">
            <input type="text" v-model="comment.text_comment" :id="`comment-edit-${comment.id}`" v-if="commentEditingId == comment.id && isCommentAuthorOrAdmin(comment)" @blur="updateComment(comment.id, comment.text_comment)" @keydown.enter="updateComment(comment.id, comment.text_comment)"/>
            <p v-else >{{ comment.text_comment }}</p>
          </div>
          <!-- Boutons supprimer et modifier -->
          <div class="card-comment__btn">
            <button class="btn btn--outlined btn-delete" @click.prevent="deleteComment(comment.id)" v-if="isCommentAuthorOrAdmin(comment)">Supprimer
            </button>
            <button class="btn btn--outlined" @click.prevent="setEditingComment(comment)" v-if="isCommentAuthorOrAdmin(comment)">Modifier</button>
          </div>
        </div>
        <!-- FIN COMMENTAIRES -->
        <!-- DEBUT AJOUT DE COMMENTAIRE -->
        <div class="add-comments">
          <textarea v-model="textComment[index]" id="write-comment" cols="100" rows="1" placeholder="Ecrivez un commentaire..."></textarea>
          <button class="btn" @click.prevent="createComment(post.id, index)">Commenter</button>
        </div>
        <!-- FIN AJOUT DE COMMENTAIRE -->
      </div>
    </div>
    <!-- FIN TOUTES LES PUBLICATIONS -->

  </div>
</template>

<script>
import Nav from '../components/Nav.vue'

const axios = require("axios");
const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default {
  name: 'Posts',
  components: {
    Nav
  },
  data: function() {
    return {
      userStore: this.$store.state.user,
      auth: 'Bearer ' + this.$store.state.user.token,
      posts: [],
      textPost: '',
      image: null,
      url: null,
      urlUpdate: null,
      textComment: [],
      postEditingId: '',
      commentEditingId: '',
    }  
  },
  computed: {
  },
  methods: {
    getAllPostsAndComments: function() {
      const self = this;
      instance.get("/posts", {
        headers: {
        Authorization: this.auth,
        }
      }).then(function (response) {
        self.posts = response.data;
        for (let i = 0; i < self.posts.length; i++) {
          instance.get("/posts/" + self.posts[i].id + "/comments", {
            headers: {
            Authorization: self.auth,
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
      this.url = URL.createObjectURL(this.image);
      //console.log(this.image);
    },
    createPost: function() {
      // On crée le l'objet javascript form data
      const formData = new FormData();
      // On ajoute les données que l'on souhaite dans le form data. S'il y a une image, on récupère le texte, l'image et l'userId. Si non, on récupère le texte et l'userId.
      if (this.image != null && 
      (this.image.type === "image/jpeg" || this.image.type === "image/jpg" || this.image.type === "image/png" || this.image.type === "image/gif")) {
        formData.append('textPost', this.textPost);
        formData.append('image', this.image, this.image.name);
        formData.append('userId', this.userStore.userId);
      } else {
        formData.append('textPost', this.textPost);
        formData.append('userId', this.userStore.userId);
      }

      // Requête POST pour envoyer le form data à l'API
      instance.post("/posts", formData, {
        headers: {
        Authorization: this.auth,
        }
      }).then(() => {
        this.getAllPostsAndComments();
        this.textPost = "";
        this.image = null;
        this.url = null;
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    setEditingPost: function(post) {
      this.postEditingId = post.id;
      setTimeout(() => {
        document.getElementById(`post-edit-${post.id}`).focus();
      }, 1)
    },
    onFileUpdate: function(event) {
      this.image = event.target.files[0];
      this.urlUpdate = URL.createObjectURL(this.image);
    },
    deleteImage: function(post) {
      post.image_url = '';
    },
    updatePost: function(postId, postText, postImage) {
      const formData = new FormData();
      if (!postText && !postImage && this.image == null) {
        this.deletePost(postId);
      } else if (this.image != null) {
        formData.append('textPost', postText);
        formData.append('image', this.image, this.image.name);
      } else if (postImage) {
        formData.append('textPost', postText);
        formData.append('image', postImage);
      } else if (!postImage && this.image == null) {
        formData.append('textPost', postText);
      } else {
        console.log("erreur");
      }
      instance.put("/posts/" + postId, formData, {
        headers: {
        Authorization: this.auth,
        }
      }).then(() => {
          this.getAllPostsAndComments();
          this.postEditingId = '';
          this.urlUpdate = null;
        })
      .catch(function(error) {
        console.log(error);
      })
    },
    deletePost: function(postId) {      
      if (confirm("Etes-vous sûr de vouloir supprimer cette publication ?")) {
        instance.delete("/posts/" + postId, {
          headers: {
          Authorization: this.auth,
          }
        }).then(() => {
          this.getAllPostsAndComments();
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    },
    createComment: function(postId, index) {
      instance.post("/comments", {
        postId: postId,
        userId: this.userStore.userId,
        textComment: this.textComment[index],
      },{
        headers: {
        Authorization: this.auth,
        }
      }).then(() => {
        this.getAllPostsAndComments();
        this.textComment = [];
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    setEditingComment: function(comment) {
      this.commentEditingId = comment.id;
      setTimeout(() => {
        document.getElementById(`comment-edit-${comment.id}`).focus();
      }, 1)
    },
    updateComment: function(commentId, commentText) {
      instance.put("/comments/" + commentId, {
        textComment: commentText,
      },{
        headers: {
        Authorization: this.auth,
        }
      }).then(() => {
          this.getAllPostsAndComments();
          this.commentEditingId = '';
        })
      .catch(function(error) {
        console.log(error);
      })
    },
    deleteComment: function(commentId) {
    if (confirm("Etes-vous sûr de vouloir supprimer ce commentaire ?")) {
      instance.delete("/comments/" + commentId, {
        headers: {
        Authorization: this.auth,
        }
      }).then(() => {
          this.getAllPostsAndComments();
        })
        .catch(function(error) {
          console.log(error);
        }); 
      }
    },
  },
  created: function() {
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

<style lang="scss">
$primary-color: #d1515a;

@mixin mobile {
    @media screen and (max-width: 767px){
        @content;
    }   
}

@mixin tablet {
    @media screen and (max-width: 992px){
        @content;
    }
}

h1 {
  padding: 20px 0;
}

.create-post {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    width: 50%;
    background: #ffd7d7;
    padding: 0 30px;
    box-shadow: 2px 2px 2px rgb(219, 219, 219);
    text-align: left;
    font-weight: bold;
  }
}

.all-posts {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  width: 50%;
  background: #fff;
  box-shadow: 2px 2px 2px rgb(219, 219, 219);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px 30px;
  margin: 0 0 10px 0;
  border-radius: 10px;

  @include tablet {
    width: 70%;
  }

  @include mobile {
    width: 80%;
  }

  & a {
    text-decoration: none;
    color: #000;
    font-weight: bold;

    &:hover {
      color: $primary-color;
    }
  }

  &__title {
    font-weight: bold;

    font-size: 1.2em;
  }
}

.card-post {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  width: 100%;

  &__name {
    font-weight: bold;
    margin-bottom: 0;
  }

  &__date {
    font-size: 0.9em;
    color: grey;
    margin: 3px 0 10px 0;
  }

  &__content {
    margin-top: 0px;
  }

  &__image {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__image img{
    max-width: 100%;
    max-height: 300px;
    margin: 10px 0;
  }
}

img {
    max-width: 100%;
    max-height: 300px;
    margin: 10px 0;
}

.card-comment {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #f0f2f5;
  padding: 0px 15px 8px 15px;
  border-radius: 15px;
  margin-bottom: 10px;
  font-size: 0.9em;
  text-align: left;

  &__name{
    font-weight: bold;
    margin-bottom: 0;
  }
  &__date {
    font-size: 0.8em;
    color: grey;
    margin: 3px 0;
  }
  &__content{
    margin-top: 5px;
  }
}

.add-comments {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items:flex-end;

  & button {
    margin-left: 10px;
  }
}

.form {
  width: 100%;
  text-align: start;

}

textarea {
  max-width: 100%;
  width: 100%;
  padding: 8px 3px;
  line-height: 1.5;
  font-size: 0.9em;
  background: #f0f2f5;
  border: none;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

input {
  margin: 10px 0;
}

.btn-delete {
  margin-right: 10px;
}

hr {
    border: none;
    border-top: 1px solid #ececec;
    width: 100%;
    margin: 10px 0;
}

</style>
