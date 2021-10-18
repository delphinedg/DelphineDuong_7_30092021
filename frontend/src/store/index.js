import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// On importe le package axios pour faire nos requêtes HTTP
const axios = require("axios");

// On crée une constante pour sauvegarder l'URL de base de l'API
const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// On crée une variable user qui est égale au user stocké dans le local storage.
// S'il n'y a pas de user dans le LS, user = userId -1 et token vide. Si non, on récupère les données user dans le local storage et on ajoute le token dans les headers. S'il y a une erreur, on définit le userId à -1 et le token vide.
let user = localStorage.getItem("user");
if (!user) {
  user = {
    userId: -1,
    token: "",
    isAdmin: -1,
  };
} else {
  try {
    user = JSON.parse(user);
    instance.defaults.headers.common["Authorization"] = user.token;
  } catch (ex) {
    user = {
      userId: -1,
      token: "",
      isAdmin: -1,
    };
  }
}

// Nouvelle instance store
export default new Vuex.Store({
  state: {
    user: user,
  },
  mutations: {
    // Lorsqu'on se connecte, on sauvegarde les données du user (userId et token) dans le local storage (pour rester connecter quand on actualise les pages).
    logUser: function(state, user) {
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },
    // Lorsqu'on se déconnecte, on redéfinit le state du user (userId -1 et token vide) et on supprime le user du local storage (la méthode se trouve dans "components > Nav.vue").
    logout: function(state) {
      state.user = {
        userId: -1,
        token: "",
      };
      localStorage.removeItem("user");
    },
  },
  actions: {
    login: ({ commit }, userInfos) => {
      return new Promise((resolve, reject) => {
        //console.log(userInfos);
        instance
          .post("/auth/login", userInfos)
          .then(function(response) {
            commit("logUser", response.data);
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },
    createAccount: ({ commit }, userInfos) => {
      return new Promise((resolve, reject) => {
        commit;
        instance
          .post("/auth/signup", userInfos)
          .then(function(response) {
            resolve(response);
          })
          .catch(function(error) {
            reject(error);
          });
      });
    },
  },
  modules: {},
});
