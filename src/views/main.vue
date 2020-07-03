<template>
  <v-app>
    <!-- SIDEBAR -->
    <v-navigation-drawer dark app color="sidebarcolor" :mini-variant="mini">
      <v-list-item style="height:48px;background: #fff;border-right:1px solid #dbdbdb">
        <v-list-item-content v-if="!mini">
          <v-list-item-title class="title">
            <v-img max-height="30" max-width="30" class="mr-2" contain src="@/assets/wiljon.png"/>
            Wiljon
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon small @click="mini = !mini" color="baretcolor">
            <v-icon>{{mini?"mdi-chevron-double-right":"mdi-chevron-double-left"}}</v-icon>
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
            <v-icon small>mdi-robot</v-icon>
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
      <div class="activemenu">
        <v-icon small color="sidebarcolor" class="mr-2">mdi-robot</v-icon>
        {{currentRouteName}}
      </div>
      <v-spacer></v-spacer>
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item link>
            <v-list-item-title @click="logout">
              <v-icon dense class="mr-2">mdi-logout</v-icon>
              Sign Out
            </v-list-item-title>
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
.title {
  display: flex;
  align-items: center;
  color: var(--v-sidebarcolor-darken1);
}
.active {
  background: var(--v-sidebarcolor-darken1);
  border-left: 3px solid var(--v-baretcolorlight-base);
}
.main-container {
  background: #dbdbdb;
  height: 100%;
}
.activemenu {
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--v-sidebarcolor-base);
  font-weight: 450;
  padding: 0 5px;
}
</style>
<script>
export default {
  data: () => ({
    mini: false
  }),
  methods: {
    logout() {
      this.$api.auth.logout();
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  }
};
</script>