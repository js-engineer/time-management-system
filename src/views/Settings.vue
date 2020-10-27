<template>
  <v-container class="fill-height" fluid>
    <v-snackbar v-model="showSnackBar" top :color="snackBarColor">
      {{ snackBarText }}
    </v-snackbar>
    <NavigationBar activeItem="Settings" />
    <div class="ml-5 pa-3 main-content">
      <v-form v-model="valid">
        <v-row>
          <v-col sm="12">
            <h2 class="text-left">User Settings</h2>
          </v-col>
        </v-row>
        <v-text-field
          label="Username"
          v-model="name"
          :rules="nameRules"
          required
        ></v-text-field>
        <v-text-field
          label="Preffered working hours"
          v-model="preferredHours"
          :rules="preferredHoursRules"
          type="number"
          required
        ></v-text-field>
        <v-layout class="mt-3" align-center justify-end>
          <v-btn @click="onClose" class="error white--text mr-5">
            Close Account
          </v-btn>
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
    <v-dialog v-model="showCloseDialog" width="500">
      <v-card>
        <v-card-title class="headline red lighten-2 white--text">Confirm close</v-card-title>
        <v-card-text class="text-left mt-5">
          Are you sure to delete your account? All records will be removed too.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onConfirmClose()">OK</v-btn>
          <v-btn color="primary" text @click="showCloseDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import NavigationBar from '../components/NavigationBar'

export default {
  name: 'Settings',
  components: {
    NavigationBar,
  },
  data() {
    return {
      valid: false,
      name: '',
      nameRules: [
        (v) => !!v || 'Name is required',
      ],
      preferredHours: '',
      preferredHoursRules: [
        (v) => !!v || 'PreferredHours is required',
      ],
      showSnackBar: false,
      snackBarColor: '',
      snackBarText: '',
      processing: false,
      showCloseDialog: false,
    }
  },
  mounted() {
    this.name = this.$store.state.auth.user.name
    this.preferredHours = this.$store.state.auth.user.preferredHours
  },
  methods: {
    async onSave() {
      this.processing = true
      try {
        const res = await this.$store.dispatch('profile/updateSettings', {
          name: this.name,
          preferredHours: this.preferredHours
        })
        if (res.succeed) {
          this.snackBarColor = 'success'
          this.snackBarText = 'Settings updated successfully.'
          this.showSnackBar = true
          this.processing = false
        } else {
          this.processing = false
          this.snackBarColor = 'error'
          this.snackBarText = res.message
          this.showSnackBar = true
        }
      } catch (e) {
        this.processing = false
        this.snackBarColor = 'error'
        this.snackBarText = 'Settings update failed. Try again.'
        this.showSnackBar = true
      }
    },
    onClose() {
      this.showCloseDialog = true
    },
    async onConfirmClose() {
      try {
        const res = await this.$store.dispatch('profile/closeAccount')
        if (res.succeed) {
          this.snackBarColor = 'success'
          this.snackBarText = 'Account closed.'
          this.showSnackBar = true
          setTimeout(() => {
            this.$store.commit('auth/logout')
            this.$router.push({ name: 'LogIn' })
          }, 2000)
        } else {
          this.snackBarColor = 'error'
          this.snackBarText = res.message
          this.showSnackBar = true
        }
      } catch (e) {
        this.snackBarColor = 'error'
        this.snackBarText = 'Account close failed. Try again.'
        this.showSnackBar = true
      }
    }
  }
}
</script>
