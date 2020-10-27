<template>
  <v-container class="fill-height" fluid>
    <v-snackbar v-model="showSnackBar" top :color="snackBarColor" timeout="3000">
      {{ snackBarText }}
    </v-snackbar>
    <NavigationBar activeItem="MyRecords" />
    <div class="ml-5 pa-3 main-content">
      <v-row>
        <v-col sm="12">
          <h2 class="text-left">My Record List</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="4">
          <DatePicker v-model="from" label="From" />
        </v-col>
        <v-col sm="4">
          <DatePicker v-model="to" label="To" />
        </v-col>
        <v-col class="d-flex justify-content-end" sm="4">
          <v-spacer></v-spacer>
          <v-btn class="mt-4 mr-5" color="success" @click="onExport()">
            <v-icon dark left>
              mdi-export
            </v-icon>
            Export
          </v-btn>
          <v-btn class="mt-4" color="primary" @click="onNew()">
            <v-icon dark left>
              mdi-plus
            </v-icon>
            New
          </v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="records"
        :options.sync="options"
        :server-items-length="totalCounts"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:body="props">
          <tbody>
            <tr
              v-for="(item, index) in props.items"
              :key="index"
              :class="item.hours > preferredHours ? 'red lighten-5' : 'blue lighten-5'"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item['user']['name'] }}</td>
              <td>{{ item['date'].split('T')[0] }}</td>
              <td>{{ item['hours'] }}</td>
              <td>{{ item['notes'][0] ? `${item['notes'][0]} [${item['notes'].length}]` : '[0]' }}</td>
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
          Are you sure to delete this record?
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
import DatePicker from '../components/DatePicker'

export default {
  name: 'MyRecords',
  components: {
    NavigationBar,
    DatePicker,
  },
  computed: {
    preferredHours() {
      return this.$store.state.auth.user.preferredHours
    }
  },
  data() {
    return {
      headers: [
        { text: 'No', align: 'center', sortable: false },
        { text: 'Name', align: 'center', sortable: false },
        { text: 'Date', align: 'center', sortable: false },
        { text: 'Hours', align: 'center', sortable: false },
        { text: 'Note', align: 'center', sortable: false },
        { text: 'Actions', align: 'center', sortable: false },
      ],
      loading: true,
      options: {},
      records: [],
      totalCounts: 0,
      from: null,
      to: null,
      showDeleteDialog: false,
      selectedId: null,
      showSnackBar: false,
      snackBarColor: '',
      snackBarText: '',
      exporting: false,
    }
  },
  watch: {
    options: {
      handler () {
        this.getRecords()
      },
      deep: true,
    },
    from: {
      handler () {
        this.getRecords()
      }
    },
    to: {
      handler () {
        this.getRecords()
      }
    }
  },
  mounted() {
    this.getRecords()
  },
  methods: {
    async getRecords() {
      try {
        this.loading = true
        const params = {
          userId: this.$store.state.auth.user._id,
          pageNum: this.options.page,
          pageSize: this.options.itemsPerPage,
        };
        if (this.from) {
          params['from'] = this.from
        }
        if (this.to) {
          params['to'] = this.to
        }
        const res = await this.$store.dispatch('record/getUserRecordList', params)
        if (res.succeed) {
          this.records = res.records
          this.totalCounts = res.totalCounts
          this.loading = false
        }
      } catch (e) {
        this.loading = false
      }
    },
    onNew() {
      this.$router.push({ name: 'MyRecordDetail' })
    },
    onEdit(id) {
      this.$router.push({ name: 'MyRecordDetail', query: { id } })
    },
    onDelete(id) {
      this.selectedId = id
      this.showDeleteDialog = true
    },
    async onConfirmDelete() {
      try {
        const res = await this.$store.dispatch('record/deleteRecord', { id: this.selectedId })
        if (res.succeed) {
          this.snackBarColor = 'success'
          this.snackBarText = 'Record deleted successfully.'
          this.showDeleteDialog = false
          this.showSnackBar = true
          this.getRecords()
        } else {
          this.snackBarColor = 'error'
          this.snackBarText = res.message
          this.showDeleteDialog = false
          this.showSnackBar = true
        }
      } catch (e) {
        this.snackBarColor = 'error'
        this.snackBarText = 'Record delete failed. Try again.'
        this.showDeleteDialog = false
        this.showSnackBar = true
      }
    },
    async onExport() {
      try {
        this.exporting = true
        const params = {
          userId: this.$store.state.auth.user._id,
        };
        if (this.from) {
          params['from'] = this.from
        }
        if (this.to) {
          params['to'] = this.to
        }
        const res = await this.$store.dispatch('record/downloadUserRecordSheet', params)
        if (res.succeed) {
          const blob = new Blob([res.data], { type: 'application/html' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = 
            `Records (${this.from ? this.from : ''} - ${this.to ? this.to : ''}).html`
          link.click()
          URL.revokeObjectURL(link.href)
        }
      } catch (e) {
        this.exporting = false
      }
    }
  }
}
</script>
