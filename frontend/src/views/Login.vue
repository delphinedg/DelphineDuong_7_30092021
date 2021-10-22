<template>
  <div class="login">
    <div>
        <img id="logo" alt="Groupomania logo" src="../assets/logo.svg">
    </div>
    <div class="card-log">
      <h1 class=card-log__title v-if="mode == 'login'">Connexion</h1>
      <h1 class=card-log__title v-else>Inscription</h1>
      <div class="form-row form-row--name" v-if="mode == 'signup'">
        <input v-model="lastName" class="form-row__input" type="text" placeholder="Nom" required/>
        <input v-model="firstName" class="form-row__input" type="text" placeholder="Prénom" required/>
      </div>
      <div class="form-row">
        <input v-model="email" class="form-row__input" type="text" placeholder="Email" required/>
      </div>
      <div class="form-row">
        <input v-model="password" class="form-row__input" type="password" placeholder="Mot de passe" required/>
      </div>
      <div class="form-row">
        <button class="btn btn-login" :class="{'btn--disabled' : !validateForm}" @click="login()" v-if="mode == 'login'">Se connecter</button>
        <button class="btn btn-login" :class="{'btn--disabled' : !validateForm}" @click="createAccount()" v-else>Créer mon compte</button>
      </div>
      <div class="separator">ou</div>
      <div class="form-row">
        <button class="btn btn-login btn--outlined" @click="switchToSignup()" v-if="mode == 'login'">S'incrire</button>
        <button class="btn btn-login btn--outlined" @click="switchToLogin()" v-else>Se connecter</button>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: 'Login',
  data: function () {
    return {
      mode: 'login',
      lastName: '',
      firstName: '',
      email: '',
      password: '',
    }
  },
  computed: {
    // Fonction pour ajouter la classe "btn--disabled" si la valeur = false et pour enlever la classe si la valeur = true.
    validateForm: function() {
      // Si mode = signup : si les champs ne sont pas vides on retourne true, sinon on retourne false.
      if (this.mode == 'signup') {
        if (this.lastName != "" && this.firsName != "" && this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      } // Si non (mode = login) : si les champs ne sont pas vides on retourne true, sinon on retourne false. 
      else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },

  },
  methods: {
    // Fonctions pour changer de mode lorsqu'on clique sur le bouton "s'inscrire" ou "se connecter".
    switchToSignup: function() {
      this.mode = 'signup';
    },
    switchToLogin: function() {
      this.mode = 'login';
    },
    // Fonction pour se connecter (action dans le store)
    login: function() {
      const self = this;
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password,
      }).then(function () {
        // On va sur la page des publications
        self.$router.push('/posts');
      }), function (error) {
        console.log(error);
      }
    },
    // Fonction pour créer un compte
    createAccount: function() {
      const self = this;
      this.$store.dispatch('createAccount', {
        lastName: this.lastName,
        firstName: this.firstName,
        email: this.email,
        password: this.password,
      }).then(function () {
        // On appelle la méthode de login() pour se connecter
        self.login();
      }), function (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style scoped lang="scss">
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

.login {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh;
}

#logo {
  max-width: 80%;
  width: 400px;
  padding-bottom: 20px;
}

.card-log {
  max-width: 80%;
  width: 540px;
  background:white;
  border-radius: 10px;
  padding:32px;

  &__title {
    text-align:center;
  }

  &subtitle {
    text-align: center;
  }
}

.form-row {
  display: flex;
  margin: 16px 0px;
  flex-wrap: wrap;
  gap:16px;
  justify-content: center;

  &__input {
    display:flex;
    border: none;
    background:#f2f2f2;
    font-weight: 500;
    font-size: 16px;
    flex:1;
    min-width: 100px;
    color: black;
    padding: 15px;
  }
}

.form-row--name {
  @include mobile() {
    display: flex;
    flex-direction: column;
  }
}

.separator {
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    font-weight: 700;
    margin: 20px auto;
    
    &::before {
      right: .5em;
    }

    &::after {
      left: .5em;
    }
}

.separator::before, .separator::after {
  content: "";
  display: inline-block;
  position: relative;
  height: 1px;
  width: 45%;
  background-color: #666;
  vertical-align: middle;
}
</style>
