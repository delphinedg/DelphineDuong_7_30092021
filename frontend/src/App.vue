<template>
  <div id="app">
    <router-view/>
  </div>
</template>

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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  max-width: 100%;
}

body {
  margin: 0;
  padding: 0;
  background: #F0F2F5;
}

.btn {
    background: $primary-color;
    color:white;
    border: none;
    padding: 10px;
    font-size: 0.9em;
    transition: .4s background-color;
    &:hover {
      cursor: pointer;
      background: darken($primary-color, 5);
    }

    &-login {
      width: 50%;
      font-size: 16px;
      font-weight: bold;
      padding: 16px;
    }

    &--disabled{
      background: #cecece;
      color: #ececec;

      &:hover{
        cursor: not-allowed;
        background: #cecece;
      }
    }

    &--outlined {
      background: #fff;
      color: $primary-color;
      border: 1px solid $primary-color;

      &:hover {
        color: #fff;
      }
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

  &__image img{
    max-width: 100%;
    max-height: 350px;
  }
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

hr {
    border: none;
    border-top: 1px solid #ececec;
    width: 100%;
    margin: 10px 0;
}
</style>
