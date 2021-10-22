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


</style>
