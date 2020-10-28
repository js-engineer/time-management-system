<template>
  <v-container class="fill-height" fluid>
    <v-snackbar v-model="showSnackBar" top :color="snackBarColor" timeout="3000">
      {{ snackBarText }}
    </v-snackbar>
    <NavigationBar activeItem="Users" />
    <div class="ml-5 pa-3 main-content">
      <v-row>
        <v-col sm="4">
          <h2 class="text-left">User List</h2>
        </v-col>
        <v-col class="d-flex justify-end" sm="8">
          <v-btn color="primary" @click="onNew()">
            <v-icon dark left>
              mdi-plus
            </v-icon>
            New
          </v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="users"
        :options.sync="options"
        :server-items-length="totalCounts"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:body="props">
          <tbody>
            <tr v-for="(item, index) in props.items" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item['name'] }}</td>
              <td>{{ item['email'] }}</td>
              <td>{{ item['preferredHours'] }}</td>
              <td>{{ item['role'] }}</td>
              <td>
                <v-btn text icon color="blue darken-2" @click="onEdit( item['_id'] )">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn text icon color="red lighten-2" @click="onDelete( item['_id'] )">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </div>
    <v-dialog v-model="showDeleteDialog" width="500">
      <v-card>
        <v-card-title class="headline blue lighten-2 white--text">Confirm delete</v-card-title>
        <v-card-text class="text-left mt-5">
          Are you sure to delete this user? All records will be removed too.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onConfirmDelete()">OK</v-btn>
          <v-btn color="primary" text @click="showDeleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import NavigationBar from '../components/NavigationBar'

export default {
  name: 'Users',
  components: {
    NavigationBar,
  },
  data() {
    return {
      headers: [
        { text: 'No', align: 'center', sortable: false },
        { text: 'Name', align: 'center', sortable: false },
        { text: 'E-mail', align: 'center', sortable: false },
        { text: 'PreferredHours', align: 'center', sortable: false },
        { text: 'Role', align: 'center', sortable: false },
        { text: 'Actions', align: 'center', sortable: false },
      ],
      loading: true,
      options: {},
      users: [],
      totalCounts: 0,
      showDeleteDialog: false,
      selectedId: null,
      showSnackBar: false,
      snackBarColor: '',
      snackBarText: '',
    }
  },
  watch: {
    options: {
      handler () {
        this.getUsers()
      },
      deep: true,
    },
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      try {
        this.loading = true
        const params = {
          pageNum: this.options.page,
          pageSize: this.options.itemsPerPage,
        };
        const res = await this.$store.dispatch('user/getUserList', params)
        if (res.succeed) {
          this.users = res.users
          this.totalCounts = res.totalCounts
          this.loading = false
        }
      } catch (e) {
        this.loading = false
      }
    },
    onNew() {
      this.$router.push({ name: 'UserDetail' })
    },
    onEdit(id) {
      this.$router.push({ name: 'UserDetail', query: { id } })
    },
    onDelete(id) {
      this.selectedId = id
      this.showDeleteDialog = true
    },
    async onConfirmDelete() {
      try {
        const res = await this.$store.dispatch('user/deleteUser', { id: this.selectedId })
        if (res.succeed) {
          this.snackBarColor = 'success'
          this.snackBarText = 'User deleted successfully.'
          this.showDeleteDialog = false
          this.showSnackBar = true
          this.getUsers()
        } else {
          this.snackBarColor = 'error'
          this.snackBarText = res.message
          this.showDeleteDialog = false
          this.showSnackBar = true
        }
      } catch (e) {
        this.snackBarColor = 'error'
        this.snackBarText = 'User delete failed. Try again.'
        this.showDeleteDialog = false
        this.showSnackBar = true
      }
    }
  }
}
</script>
