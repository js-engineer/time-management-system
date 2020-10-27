<template>
  <v-container class="fill-height" fluid>
    <v-snackbar v-model="showSnackBar" top :color="snackBarColor">
      {{ snackBarText }}
    </v-snackbar>
    <NavigationBar activeItem="ChangePassword" />
    <div class="ml-5 pa-3 main-content">
      <v-form v-model="valid">
        <v-row>
          <v-col sm="12">
            <h2 class="text-left">Change Password</h2>
          </v-col>
        </v-row>
        <v-text-field
          label="Old Password"
          v-model="oldPassword"
          type="password"
          :rules="passwordRules"
          required
        ></v-text-field>
        <v-text-field
          label="New Password"
          v-model="newPassword"
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
  name: 'ChangePassword',
  components: {
    NavigationBar,
  },
  data() {
    return {
      valid: false,
      oldPassword: '',
      newPassword: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
      ],
      cpassword: '',
      cpasswordRules: [
        (v) => !!v || 'Password is required',
        (v) => (this.newPassword === v) || 'Password must match'
      ],
      showSnackBar: false,
      snackBarColor: '',
      snackBarText: '',
      processing: false,
    }
  },
  methods: {
    async onSave() {
      this.processing = true
      const data = {
        old: this.oldPassword,
        new: this.newPassword, 
      }
      try {
        const res = await this.$store.dispatch('profile/changePassword', data)
        if (res.succeed) {
          this.snackBarColor = 'success'
          this.snackBarText = 'Password updated successfully.'
          this.showSnackBar = true
          this.processing = false
        } else {
          this.snackBarColor = 'error'
          this.snackBarText = res.message
          this.showSnackBar = true
          this.processing = false
        }
      } catch (e) {
        this.snackBarColor = 'error'
        this.snackBarText = 'Password update failed. Try again.'
        this.showSnackBar = true
        this.processing = false
      }
    }
  }
}
</script>
