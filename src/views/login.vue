<template>
  <v-app>
    <div class="app-container">
      <img class="wave" src="@/assets/wave.png" />
      <div class="container">
        <div class="img">
          <img src="@/assets/bg.svg" />
        </div>
        <div class="login-content">
          <v-form v-model="valid" @submit.prevent="submit">
            <img src="@/assets/avatar.svg" />
            <h2 class="title">Welcome</h2>
            <v-text-field
              v-model="user.username"
              label="Username"
              color="teal accent-4"
              :rules="nameRules"
              prepend-icon="fas fa-user"
            />
            <v-text-field
              v-model="user.password"
              label="Password"
              type="password"
              color="teal accent-4"
              :rules="passRules"
              prepend-icon="fas fa-lock"
            />
            <input type="submit" class="btn" value="Login" />
          </v-form>
        </div>
      </div>
    </div>
  </v-app>
</template>
<script>
export default {
  name: "Login",
  data: () => ({
    valid: false,
    user: {
      username: "",
      password: ""
    },
    nameRules: [v => !!v || "Name is required"],
    passRules: [v => !!v || "Password is required"]
    //
  }),
  methods: {
    submit() {
      this.$api.auth.login(this.user);
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  z-index: 1;
}
.wave {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100%;
  z-index: -1;
}
.container {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 7rem;
  padding: 0 2rem;
}
.img {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  img {
    width: 500px;
  }
}
.login-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  img {
    height: 100px;
  }
  h2 {
    margin: 15px 0;
    color: #333;
    text-transform: uppercase;
    font-size: 2.9rem;
  }
}

form {
  width: 360px;
}

a {
  display: block;
  text-align: right;
  text-decoration: none;
  color: #999;
  font-size: 0.9rem;
  transition: 0.3s;
}

a:hover {
  color: #38d39f;
}

.btn {
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  outline: none;
  border: none;
  background-image: linear-gradient(to right, #32be8f, #38d39f, #32be8f);
  background-size: 200%;
  font-size: 1.2rem;
  color: #fff;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  margin: 1rem 0;
  cursor: pointer;
  transition: 0.5s;
}
.btn:hover {
  background-position: right;
}

@media screen and (max-width: 1050px) {
  .container {
    grid-gap: 5rem;
  }
}

@media screen and (max-width: 1000px) {
  form {
    width: 290px;
  }

  .login-content h2 {
    font-size: 2.4rem;
    margin: 8px 0;
  }

  .img img {
    width: 400px;
  }
}

@media screen and (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }

  .img {
    display: none;
  }

  .wave {
    display: none;
  }

  .login-content {
    justify-content: center;
  }
}
</style>