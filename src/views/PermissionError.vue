<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center" fluid>
    <h1>Whoops, you don't have permission to this page.</h1>
    <router-link :to="{ name: 'MyRecords' }">Go to Main Page</router-link>
  </v-container>
</template>

<script>

export default {
  name: 'PermissionError',
}
</script>
