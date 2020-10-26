<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center" fluid>
    <v-snackbar v-model="showSnackBar" top color="error">
      {{ snackBarText }}
    </v-snackbar>
    <h1 v-if="!verified">Please wait until e-email is verified.</h1>
    <h1 v-else>Your e-mail has been verified successfully.<br />You can log in now and enjoy with Time Management.</h1>
    <router-link :to="{ name: 'LogIn' }">Go to LogIn</router-link>
  </v-container>
</template>

<script>

export default {
  name: 'VerifyEmail',
  data() {
    return {
      verified: false,
      showSnackBar: false,
      snackBarText: ''
    }
  },
  mounted() {
    this.$store.dispatch('auth/verifyEmail', {
      token: this.$route.params.token
    })
    .then(res => {
      if (res.succeed) {
        this.verified = true
      } else {
        this.snackBarText = res.message
        this.showSnackBar = true
      }
    })
  },
}
</script>
