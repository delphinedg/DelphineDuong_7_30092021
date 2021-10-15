<template>
    <div id="nav">
        <div id=nav__logo>
            <img id="nav__logo" alt="Groupomania logo" src="../assets/logo-white.svg"/>
        </div>
        <div id="nav__link">
            <router-link to="/posts">Fil d'actualité</router-link> |
            <router-link :to="{ name: 'Profile', params: { id: user.userId }}">Mon compte</router-link> |
            <button @click="logout()">Déconnexion</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Nav',
  computed: {
    // On récupère le user dans le store afin de mettre l'userId dans l'URL.
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
      // Quand on clique sur le bouton déconnecter, on fait appel à la mutation logout du store et on retourne vers la page de connexion (/).
      logout: function() {
          this.$store.commit('logout');
          this.$router.push('/');
      }
  }
}
</script>

<style scoped lang="scss">
#nav {
  padding: 30px 50px;
  background: rgb(56, 56, 56);
  display: flex;
  justify-content:space-between;
  align-content: center;

  &__logo{
      width: 150px;
  }

    a {
    font-weight: bold;
    color: #fff;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>