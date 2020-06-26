<template>
  <v-app>
    <!-- SIDEBAR -->
    <v-navigation-drawer dark app color="#181f47" :mini-variant="mini">
      <v-list-item style="height:48px;">
        <v-list-item-content v-if="!mini">
          <v-list-item-title class="title">Application</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon small @click="mini = !mini" :color=" mini? 'baretcolor_light': ''">
            <v-icon small>{{mini?"fa-expand-arrows-alt":"fa-compress-arrows-alt"}}</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider />
      <v-list dense class="pa-0">
        <!-- <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>-->
        <v-list-item link class="active">
          <v-list-item-action>
            <v-icon>mdi-robot</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Tanda Terima</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- END SIDEBAR -->
    <!-- TOP SIDEBAR -->
    <v-app-bar app dense color="white">
      <v-spacer></v-spacer>
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item link>
            <v-list-item-title @click="logout">Sign Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <!-- END TOP SIDEBAR -->

    <!-- CONTENT -->
    <v-main>
      <v-container fluid class="main-container">
        <router-view></router-view>
      </v-container>
    </v-main>
    <!-- END CONTENT -->
  </v-app>
</template>
<style lang="scss" scoped>
.active {
  background: #0f1634;
  border-left: 3px solid #ffd609;
}
.main-container{
    background: #dbdbdb;
    height:100%;
}
</style>
<script>
export default {
  data: () => ({
    mini: false
  }),
  methods: {
      logout(){
          this.$api.auth.logout()
      }
  }
};
</script>