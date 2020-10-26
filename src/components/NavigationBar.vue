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
            Main Menu
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>My Records</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>Records</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: 'NavigationBar',
  data() {
    return {}
  },
  methods: {
  }
}
</script>
