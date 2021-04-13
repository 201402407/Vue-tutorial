<template>
  <div id="app">
    <div id="nav">
      <bottom-navigation @selected="selectNavigation"></bottom-navigation>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import BottomNavigation from '@/components/BottomNavigation.vue'

@Component({
  components: {
    'bottom-navigation': BottomNavigation
  }
})
export default class App extends Vue {
  private selectedMenu = 'main'
  private isOpenMenu = false

  private selectNavigation(menu: string) {
    console.log("[App.vue] selectNavigation Called!")
    this.selectedMenu = menu
  }
}

</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
