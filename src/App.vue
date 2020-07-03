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
<style lang="scss">
.no-uppercase {
    text-transform: none !important;
}
</style>

<script>
/* 
  Status
    -1  -> delete 
    0   -> on progress
    1   -> finish
    2   -> closed

  Detail Status
    (status = 0)
      0   -> cek
      1   -> konfirmasi
      2   -> perbaikan
    (status = 1)
      0   -> selesai
      1   -> canceled
    (status = 2)
      0   -> -
*/
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
