<template>
  <v-app>
    <v-app-bar app class="primary">
      <h1 class="white--text">Time Management</h1>
      <v-spacer />
      <v-btn v-if="authenticated" text class="white--text">
        <span class="mr-2" @click="logout">Log out</span>
      </v-btn>
    </v-app-bar>
    <v-main app>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    authenticated() {
      return !!this.$store.state.auth.user
    }
  },
  methods: {
    logout() {
      this.$store.commit('auth/logout')
      this.$router.push({ name: 'LogIn' })
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
}
</style>
