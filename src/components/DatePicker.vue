<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="value"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        :rules="rules"
      ></v-text-field>
    </template>
    <v-date-picker no-title :value="value" @input="updateDate">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
      <v-btn text color="primary" @click="clearDate">Clear </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'DatePicker',
  props: ['label', 'value', 'rules'],
  data() {
    return {
      menu: false,
    }
  },
  methods: {
    clearDate() {
      this.$emit('input', null)
      this.menu = false
    },
    updateDate(value) {
      this.$emit('input', value)
      this.menu = false
    }
  }
}
</script>
