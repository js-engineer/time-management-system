<template>
  <v-container class="fill-height" fluid>
    <v-snackbar v-model="showSnackBar" top :color="snackBarColor">
      {{ snackBarText }}
    </v-snackbar>
    <NavigationBar />
    <div class="ml-5 pa-3 main-content">
      <v-form v-model="valid">
        <v-row>
          <v-col sm="12">
            <h2 class="text-left">My Record Detail</h2>
          </v-col>
        </v-row>
        <DatePicker v-model="date" label="Date" :rules="dateRules" />
        <v-text-field
          label="Hours"
          v-model="hours"
          type="number"
          :rules="hoursRules"
          required
        ></v-text-field>
        <v-card
          class="mx-auto"
          subheader
          tile
        >
          <v-subheader>
            Notes
            <v-spacer></v-spacer>
            <v-btn text icon color="blue darken-2" small @click="onNoteNew()">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-subheader>
          <v-list-item v-for="(item, index) in notes" :key="index">
            <v-list-item-content>
              <v-list-item-title class="text-left d-flex">
                <p class="text-wrap">
                  {{ item }}
                </p>
                <v-spacer></v-spacer>
                <v-btn text icon color="blue darken-2" x-small @click="onNoteEdit(index)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn text icon color="red lighten-2" x-small @click="onNoteDelete(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-title>
              <v-divider></v-divider>
            </v-list-item-content>
          </v-list-item>
        </v-card>
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
    <v-dialog v-model="showNoteDialog" width="500">
      <v-card>
        <v-card-title class="headline blue lighten-2">{{ noteIndex === -1 ? 'Add note' : 'Edit note' }}</v-card-title>
        <v-card-text>
          <v-textarea
            name="input-7-1"
            label="Enter your note"
            v-model="noteText"
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onNoteComplete()">Save</v-btn>
          <v-btn color="primary" text @click="showNoteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import NavigationBar from '../components/NavigationBar'
import DatePicker from '../components/DatePicker'

export default {
  name: 'MyRecordDetail',
  components: {
    NavigationBar,
    DatePicker,
  },
  data() {
    return {
      recordId: null,
      valid: false,
      date: null,
      dateRules: [
        (v) => !!v || 'Date is required',
      ],
      hours: 0,
      hoursRules: [
        (v) => !!v || 'Hours is required',
      ],
      notes: [],
      noteIndex: -1,
      noteText: '',
      showNoteDialog: false,
      showSnackBar: false,
      snackBarColor: '',
      snackBarText: '',
      processing: false,
    }
  },
  computed: {
    userId() {
      return this.$store.state.auth.user._id
    }
  },
  watch: {
    date: {
      async handler () {
        try {
          const res = await this.$store.dispatch('record/getRecordByUserAndDate', {
            userId: this.userId,
            date: this.date
          })
          if (res.succeed) {
            this.recordId = res.record._id
            this.notes = res.record.notes
            this.hours = res.record.hours
          } else {
            this.recordId = null
            this.notes = []
            this.hours = 0
          }
        } catch (e) {
          this.recordId = null
          this.notes = []
          this.hours = 0
        }
      }
    },
  },
  async mounted() {
    if (this.$route.query.id) {
      this.recordId = this.$route.query.id
      try {
        const res = await this.$store.dispatch('record/getRecordById', { id: this.recordId })
        if (res.succeed) {
          this.notes = res.record.notes
          this.date = res.record.date.split('T')[0]
          this.hours = res.record.hours
        } else {
          this.recordId = null
          this.notes = []
          this.hours = 0
        }
      } catch (e) {
        this.recordId = null
        this.notes = []
        this.hours = 0
      }
    }
  },
  methods: {
    onSave() {
      this.processing = true
      if (this.recordId) {
        this.updateRecord()
      } else {
        this.createRecord()
      }
    },
    onNoteNew() {
      this.noteIndex = -1
      this.showNoteDialog = true
    },
    onNoteEdit(index) {
      this.noteIndex = index
      this.noteText = this.notes[index]
      this.showNoteDialog = true
    },
    onNoteDelete(index) {
      this.notes.splice(index, 1)
    },
    onNoteComplete() {
      if (this.noteIndex === -1) {
        this.notes.push(this.noteText)
      } else {
        this.notes[this.noteIndex] = this.noteText
      }
      this.showNoteDialog = false
    },
    async updateRecord() {
      try {
        const res = await this.$store.dispatch('record/updateRecord', {
          id: this.recordId,
          hours: this.hours,
          notes: this.notes
        })
        if (res.succeed) {
          this.snackBarColor = 'success'
          this.snackBarText = 'Record updated successfully.'
          this.showSnackBar = true
          setTimeout(() => {
            this.processing = false
            this.$router.push({ name: 'MyRecords' })
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
        this.snackBarText = 'Record update failed. Try again.'
        this.showSnackBar = true
      }
    },
    async createRecord() {
      try {
        const res = await this.$store.dispatch('record/createRecord', {
          user: this.userId,
          date: this.date,
          hours: this.hours,
          notes: this.notes
        })
        if (res.succeed) {
          this.snackBarColor = 'success'
          this.snackBarText = 'Record updated successfully.'
          this.showSnackBar = true
          setTimeout(() => {
            this.processing = false
            this.$router.push({ name: 'MyRecords' })
          }, 1000)
        } else {
          this.snackBarColor = 'error'
          this.snackBarText = res.message
          this.showSnackBar = true
          this.processing = false
        }
      } catch (e) {
        this.snackBarColor = 'error'
        this.snackBarText = 'Record update failed. Try again.'
        this.showSnackBar = true
        this.processing = false
      }
    }
  }
}
</script>
