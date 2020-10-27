<template>
  <v-card
    height="100%"
    width="256px"
    class="mx-0"
  >
    <v-navigation-drawer permanent class="text-left">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ username }} ({{ role }})
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item link @click="onNavigate('MyRecords')">
          <v-list-item-content>
            <v-list-item-title :class="{ 'blue--text': activeItem === 'MyRecords' }">My Records</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="role === 'manager' || role === 'admin'" link @click="onNavigate('Users')">
          <v-list-item-content>
            <v-list-item-title :class="{ 'blue--text': activeItem === 'Users' }">Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="role === 'admin'" link @click="onNavigate('Records')">
          <v-list-item-content>
            <v-list-item-title :class="{ 'blue--text': activeItem === 'Records' }">Records</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: 'NavigationBar',
  props: ['activeItem'],
  computed: {
    username() {
      return this.$store.state.auth.user.name
    },
    email() {
      return this.$store.state.auth.user.email
    },
    role() {
      return this.$store.state.auth.user.role
    }
  },
  data() {
    return {}
  },
  methods: {
    onNavigate(name) {
      this.$router.push({ name })
    }
  }
}
</script>
