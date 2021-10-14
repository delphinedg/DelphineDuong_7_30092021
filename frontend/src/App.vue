<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
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
    background: #dd2602;
    color:white;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    width: 100%;
    padding: 16px;
    transition: .4s background-color;

    &:hover {
      cursor: pointer;
      background: darken(#dd2602, 5);
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
      color: #dd2602;
      border: 1px solid #dd2602;
      width: 50%;

      &:hover {
        color: #fff;
      }
    }

    &--post{
      width: auto;
      padding: 10px 25px;
    }
  }

.all-posts, .profile, .create-post {
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
  margin: 10px 0;
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
    margin: 3px 0 5px 0;
  }

  &__content {
    margin-top: 5px;

  }
  &__image img{
    max-width: 100%;
  }
}

.card-comment {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #f0f2f5;
  padding: 0 15px;
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
    width: 20%;
    margin-left: 10px;
  }
  & textarea {
    widows: 60%;
  }
}

textarea {
  max-width: 100%;
  padding: 8px 3px;
  line-height: 1.5;
  border-radius: 15px;
  font-size: 1em;
  background: #f0f2f5;
  border: none;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

input {
  margin: 10px 0;
}

hr {
    border: none;
    border-top: 1px solid #666;
    height: 1px;
    width: 100%;
}
</style>
