<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-card width="500" class="pt-4">
      <v-snackbar v-model="showSnackBar" top color="error">
        {{ snackBarText }}
      </v-snackbar>
      <v-card-title class="text-center">
        Log In
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            label="E-mail"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            type="password"
            :rules="passwordRules"
            required
          ></v-text-field>
          <v-layout justify-space-between align-center>
            <router-link :to="{ name: 'SignUp' }">Not registered yet</router-link>
            <v-btn @click="login" class="primary white--text" :disabled="!valid">Login</v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

export default {
  name: 'LogIn',
  data () {
    return {
      showSnackBar: false,
      snackBarText: '',
      valid: false,
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid' // eslint-disable-line
      ],
    }
  },
  methods: {
    login() {
      this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password,
      })
      .then((res) => {
        if (res.succeed) {
          this.$router.push({ name: 'MyRecords' })
        } else {
          this.snackBarText = res.message
          this.showSnackBar = true
        }
      })
    }
  }
}
</script>
