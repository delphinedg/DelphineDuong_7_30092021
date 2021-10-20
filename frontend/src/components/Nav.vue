<template>
    <div class="nav">
        <div class=nav__logo>
            <img class="nav__logo" alt="Groupomania logo" src="../assets/logo.svg"/>
        </div>
        <div class="nav__link">
            <router-link to="/posts">Fil d'actualité</router-link><span class="separator"> | </span>
            <router-link :to="{ name: 'Profile', params: { id: user.userId }}">Mon compte</router-link>
        </div>

          <button @click="logout()" class="btn btn--outlined">Déconnexion</button>
  
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
@mixin mobile {
    @media screen and (max-width: 767px){
        @content;
    }   
}

.nav {
  padding: 10px 40px;
  background: #fff;
  display: flex;
  justify-content:space-between;
  align-items: center;
  box-shadow: 0px 1px 2px rgb(219, 219, 219);

  @include mobile {
    flex-direction: column;
  }

  &__logo{
      width: 150px;
  }

  &__link {
    @include mobile {
      padding: 20px;
    }
  }

    a {
    font-weight: bold;
    color: #000;
    text-decoration: none;

    &:hover {
      color: #d1515a;
    }

    &.router-link-exact-active {
      color: #d1515a;
    }
  }
}

.separator {
  color: #000;
}

</style>