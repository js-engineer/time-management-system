<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-snackbar v-model="showSnackBar" top :color="snackBarColor">
      {{ snackBarText }}
    </v-snackbar>
    <v-card width="500" class="pt-4">
      <v-card-title>
        Sign Up
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            label="Username"
            v-model="name"
            :rules="nameRules"
            required
          ></v-text-field>
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
          <v-text-field
            label="Confirm password"
            v-model="cpassword"
            type="password"
            :rules="cpasswordRules"
            required
          ></v-text-field>
          <v-text-field
            label="Preffered working hours"
            v-model="preferredHours"
            :rules="preferredHoursRules"
            type="number"
            required
          ></v-text-field>
          <v-layout align-center justify-space-between>
            <router-link :to="{ name: 'LogIn' }">Already registered</router-link>
            <v-btn @click="register" class="primary white--text" :disabled="!valid">Register</v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

export default {
  name: 'SignUp',
  components: {},
  data () {
    return {
      showSnackBar: false,
      snackBarText: '',
      snackBarColor: '',
      valid: false,
      name: '',
      nameRules: [
        (v) => !!v || 'Name is required',
      ],
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
      ],
      cpassword: '',
      cpasswordRules: [
        (v) => !!v || 'Password is required',
        (v) => (this.password === v) || 'Password must match'
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid' // eslint-disable-line
      ],
      preferredHours: '',
      preferredHoursRules: [
        (v) => !!v || 'PreferredHours is required',
      ],
    }
  },
  methods: {
    register() {
      this.$store.dispatch('auth/register', {
        name: this.name,
        email: this.email,
        password: this.password,
        preferredHours: this.preferredHours,
      })
      .then((res) => {
        if (res.succeed) {
          this.snackBarColor = 'success'
          this.snackBarText = 'Please verify your e-mail. You can check your mailbox.'
        } else {
          this.snackBarColor = 'error'
          this.snackBarText = res.message
        }
        this.showSnackBar = true
      })
    }
  }
}
</script>
