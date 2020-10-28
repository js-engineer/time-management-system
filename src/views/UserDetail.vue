<template>
  <v-container class="fill-height" fluid>
    <v-snackbar v-model="showSnackBar" top :color="snackBarColor">
      {{ snackBarText }}
    </v-snackbar>
    <NavigationBar activeItem="Users" />
    <div class="ml-5 pa-3 main-content">
      <v-form v-model="valid">
        <v-row>
          <v-col sm="12">
            <h2 class="text-left">User Detail</h2>
          </v-col>
        </v-row>
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
        <v-checkbox
          v-model="enablePasswordChange"
          :disabled="!this.userId"
          label="Change Password"
          color="indigo"
          class="mt-2 mb-2"
          hide-details
        ></v-checkbox>
        <v-text-field
          v-if="enablePasswordChange"
          label="Password"
          v-model="password"
          type="password"
          :rules="passwordRules"
          required
        ></v-text-field>
        <v-text-field
          v-if="enablePasswordChange"
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
        <v-combobox
          v-model="role"
          :items="roleItems"
          label="User Role"
        ></v-combobox>
        <v-layout class="mt-3" align-center justify-end>
          <v-btn @click="onSave" class="primary white--text" :disabled="!valid || processing">
            <v-progress-circular
              indeterminate
              color="primary"
              size="15"
              width="2"
              class="mr-2"
              v-if="processing"
            ></v-progress-circular>
            Save
          </v-btn>
        </v-layout>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import NavigationBar from '../components/NavigationBar'

export default {
  name: 'UserDetail',
  components: {
    NavigationBar,
  },
  computed: {
    userId() {
      return this.$route.query.id
    },
    roleItems() {
      if (this.$store.state.auth.user.role === 'admin') {
        return [ 'regular', 'manager' ]
      } else {
        return [ 'regular' ]
      }
    }
  },
  data() {
    return {
      recordId: null,
      valid: false,
      name: '',
      nameRules: [
        (v) => !!v || 'Name is required',
      ],
      enablePasswordChange: true,
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
      role: 'regular',
      showSnackBar: false,
      snackBarColor: '',
      snackBarText: '',
      processing: false,
    }
  },
  async mounted() {
    if (this.userId) {
      try {
        const res = await this.$store.dispatch('user/getUserById', { id: this.userId })
        if (res.succeed) {
          this.name = res.user.name
          this.email = res.user.email
          this.preferredHours = res.user.preferredHours
          this.enablePasswordChange = false
          this.role = res.user.role
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  methods: {
    onSave() {
      this.processing = true
      if (this.userId) {
        this.updateUser()
      } else {
        this.createUser()
      }
    },
    async updateUser() {
      const data = {
        id: this.userId,
        name: this.name,
        email: this.email,
        password: this.enablePasswordChange ? this.password : null,
        preferredHours: this.preferredHours,
        role: this.role,
      }
      try {
        const res = await this.$store.dispatch('user/updateUser', data)
        if (res.succeed) {
          this.snackBarColor = 'success'
          this.snackBarText = 'User updated successfully.'
          this.showSnackBar = true
          setTimeout(() => {
            this.processing = false
            this.$router.push({ name: 'Users' })
          }, 1000)
        } else {
          this.processing = false
          this.snackBarColor = 'error'
          this.snackBarText = res.message
          this.showSnackBar = true
        }
      } catch (e) {
        this.processing = false
        this.snackBarColor = 'error'
        this.snackBarText = 'User update failed. Try again.'
        this.showSnackBar = true
      }
    },
    async createUser() {
      const data = {
        name: this.name,
        email: this.email,
        password: this.password,
        preferredHours: this.preferredHours,
        role: this.role,
      }
      try {
        const res = await this.$store.dispatch('user/createUser', data)
        if (res.succeed) {
          this.snackBarColor = 'success'
          this.snackBarText = 'User created successfully.'
          this.showSnackBar = true
          setTimeout(() => {
            this.processing = false
            this.$router.push({ name: 'Users' })
          }, 1000)
        } else {
          this.snackBarColor = 'error'
          this.snackBarText = res.message
          this.showSnackBar = true
          this.processing = false
        }
      } catch (e) {
        this.snackBarColor = 'error'
        this.snackBarText = 'Record create failed. Try again.'
        this.showSnackBar = true
        this.processing = false
      }
    }
  }
}
</script>
