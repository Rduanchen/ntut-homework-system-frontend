<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-sheet
        class="pa-4"
        color="grey-lighten-4"
      >
        <v-avatar
          class="mx-auto d-flex"
          color="grey-darken-1"
          size="128"
        ></v-avatar>
        <div class="text-h6 text-center mt-2">John Doe</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="[icon, text] in links"
          :key="icon"
          :prepend-icon="icon"
          :title="text"
          link
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import api from '@/utilities/api'

  const cards = ['Today', 'Yesterday']
  const links = [
    ['mdi-inbox-arrow-down', 'Inbox'],
    ['mdi-send', 'Send'],
    ['mdi-delete', 'Trash'],
    ['mdi-alert-octagon', 'Spam'],
  ]

  const userInfo = ref<any>(null)
  const drawer = ref(null)

  onMounted(async () => {
    try {
      const response = await api.auth.getUserInfo()
      userInfo.value = response
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  })
</script>