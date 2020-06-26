<template>
  <v-app>
    <router-view></router-view>
    <v-snackbar
      v-model="message.status"
      :timeout="message.timeout"
      :color="message.type"
    >{{message.text}}</v-snackbar>
  </v-app>
</template>

<script>

export default {
  name: "App",
  data: () => ({
  }),
  computed: {
    message: {
      get() {return this.$store.state.message},
      set(value) {return this.$store.commit('message',value)}
    }
  }
};
</script>
