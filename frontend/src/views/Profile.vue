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
    Nav,
  },
  data: function() {
    return {
      userStore: this.$store.state.user,
      userProfile: [],
      auth: {
        headers: {
        Authorization: 'Bearer ' + this.$store.state.user.token,
        }
      },
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
    getAccount: function() {
      const self = this;
      // On fait une requête GET pour récupérer les informations du user. Une fois que nous avons les données (response), on insère les données dans la data "userProfile". S'il y a une erreur, on affiche l'erreur dans la console.
      instance.get("/auth/" + this.$route.params.id, this.auth)
      .then(function (response) {
        self.userProfile = response.data[0];
        return;
      })
      .catch(function (error) {
        console.log(error);
        return;
      });
    },
    deleteAccount: function() {
      // Requête DELETE pour supprimer le compte de l'utilisateur. Une fois supprimé de la base de données, si l'utilisateur est un admin, on le renvoie vers la page /posts. Si non, on déconnecte l'utilisateur et on le renvoie vers la page de connexion.
      const self = this;
      if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Vous ne pourrez plus accéder au réseau social Groupomania.")) {
        instance.delete("/auth/" + this.$route.params.id, this.auth)
        .then(function() {
          if (self.userStore.isAdmin == 1) {
            self.$router.push('/posts');
          } else {
            self.$store.commit('logout');
            self.$router.push('/');
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    },
  },
  created: function() {
    const self = this;
    // Si le user n'est pas connecté et essaye d'accéder à la page, on fait un retour vers la page de connexion.
    if (this.userStore.userId == -1) {
      this.$router.push('/');
      return;
    }
    this.getAccount();
  },
  watch: {
    '$route' () {
      this.getAccount();
    },
  },
}
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  width: 50%;
  background: #fff;
  box-shadow: 2px 2px 2px rgb(219, 219, 219);
  padding: 30px;
  border-radius: 10px;

  &__email {
    margin-top: 0;
  }

  &__image img {
    width: 40%;
  }
}
</style>
