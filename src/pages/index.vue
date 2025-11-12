<template>
  <v-app id="inspire">
    <v-system-bar> </v-system-bar>
    <v-navigation-drawer v-model="drawer">
      <v-sheet class="pa-4" color="grey-lighten-4">
        <v-avatar class="mb-4" color="grey-darken-1" size="64"></v-avatar>
        <div>{{ userInfo?.username }}</div>
        <div>{{ userInfo?.studentID }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          class="list-item"
          prepend-icon="mdi-calendar-check"
          :title="t('dashboard.homeworkList')"
        ></v-list-item>
        <v-list-item
          class="list-item"
          prepend-icon="mdi-key-variant"
          :title="t('dashboard.changePassword')"
        ></v-list-item>
        <v-list-item
          class="list-item"
          prepend-icon="mdi-logout"
          :title="t('dashboard.logout')"
          @click="logout"
        ></v-list-item>
      </v-list>
      <!-- Languange Switch -->
      <v-divider></v-divider>
      <div class="d-flex align-center justify-center pa-2">
        <v-btn icon="mdi-translate" variant="text" @click="toggleLanguage"></v-btn>
        <v-btn
          :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="text"
          @click="toggleTheme"
          class="ml-2"
        ></v-btn>
      </div>
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>{{ t('dashboard.title') }}</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import api from '@/utilities/api';
  import { useI18n } from 'vue-i18n';
  import router from '@/router';

  const { t, locale } = useI18n();
  const isDark = ref(false);
  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };
  const toggleLanguage = () => {
    locale.value = locale.value === 'en' ? 'zh' : 'en';
  };
  const userInfo = ref<any>(null);
  const drawer = ref(false);

  onMounted(async () => {
    try {
      const isLoginedIn = await api.auth.isLogin();
    } catch (error) {
      console.error('Error checking login status:', error);
      router.push('/login');
      return;
    }
    try {
      const response = await api.auth.getUserInfo();
      console.log('User info fetched:', response);
      userInfo.value = response;
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  });

  // Logout function
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      router.push('/login');
    }
  };
</script>
<style scoped>
.list-item {
  cursor: pointer;
}
</style>
