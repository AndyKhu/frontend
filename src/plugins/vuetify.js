import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        baretcolor: "#FF5722",
        baretcolorlight: "#ffe500",
        baretonprogress: {base:"#FF9800",lighten1: "#fff59d",lighten2:"#fff9c4"},
        baretfinish: {base:"#4caf50",lighten1: "#81c784",lighten2:"#c8e6c9"},
        baretclosed: {base:"#424242",lighten1: "#bdbdbd",lighten2:"#e0e0e0"},
        bareturgent:"#ff5252",
        sidebarcolor: {base:"#181f47",darken1: "#0f1634"}
      },
    },
    options: {
      customProperties: true
    }
  },
  icons: {
    iconfont: 'fa', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  }
});
