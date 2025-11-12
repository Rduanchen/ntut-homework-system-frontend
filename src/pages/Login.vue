<template>
  <v-container fluid class="login-container pa-0">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="5" xl="4">
        <v-card class="login-card rounded-xl ma-1">
          <v-card-title class="text-h4 font-weight-bold text-center text-primary py-2">
            {{ $t('system.name') }}
          </v-card-title>
          <v-card-title class="text-h6 font-weight-bold text-center justify-center py-2">
            {{ $t('login.title') }}
          </v-card-title>
          <v-card-text class="px-7 pb-2">
            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="handleLogin">
              <!-- Error Alert -->
              <v-alert
                v-if="loginError"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-1"
                closable
                @click:close="loginError = null"
              >
                {{ loginError }}
              </v-alert>

              <v-select
                v-model="selectedCourse"
                :items="courses"
                :label="$t('login.course')"
                prepend-inner-icon="mdi-school"
                variant="outlined"
                class="mb-1 form-field"
                required
              ></v-select>

              <v-text-field
                v-model="username"
                :rules="[(v) => !!v || $t('rules.required', { field: $t('login.username') })]"
                :label="$t('login.username')"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                required
                class="mb-1 form-field"
                @input="loginError = null"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="[(v) => !!v || $t('rules.required', { field: $t('login.password') })]"
                :label="$t('login.password')"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                required
                class="form-field"
                @input="loginError = null"
              ></v-text-field>

              <!-- "記住密碼" 勾選框 -->
              <v-checkbox
                v-model="savePassword"
                :label="$t('login.savePassword')"
                :messages="$t('login.publicComputerWarning')"
                color="primary"
                class="mt-1"
              ></v-checkbox>

              <v-btn
                :loading="loading"
                :disabled="!valid || loading"
                type="submit"
                block
                size="large"
                color="primary"
                class="mt-1"
              >
                {{ $t('login.button') }}
              </v-btn>
            </v-form>
          </v-card-text>

          <div class="d-flex align-center justify-center pa-2">
            <v-btn icon="mdi-translate" variant="text" @click="toggleLanguage"></v-btn>
            <v-btn
              :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
              variant="text"
              @click="toggleTheme"
              class="ml-2"
            ></v-btn>
          </div>

          <v-divider></v-divider>
          <div class="d-flex align-center justify-center pa-2">
            <span class="text-body-1 mr-3"
              >{{ $t('login.loginCount') }}: {{ formattedLoginAmount }}</span
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useTheme } from 'vuetify';
  import { useI18n } from 'vue-i18n';
  import api from '@/utilities/api'; // --- Composables ---

  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n(); // --- State ---

  const form = ref(null);
  const valid = ref(false);
  const loading = ref(false);
  const showPassword = ref(false);
  const username = ref('');
  const password = ref('');
  const selectedCourse = ref(null);
  const courses = ref([]);
  const loginAmount = ref(0);
  const loginError = ref(null);
  const savePassword = ref(true); // 新增：記住密碼的狀態，預設勾選 // --- Computed Properties ---

  const isDark = computed(() => theme.global.current.value.dark);

  const formattedLoginAmount = computed(() => {
    return loginAmount.value.toLocaleString('en-US');
  }); // --- Lifecycle Hooks ---

  onMounted(async () => {
    try {
      const isLoginedIn = await api.auth.isLogin();
      if (isLoginedIn) {
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      console.error('Failed to check login status:', error);
    }
    try {
      const [coursesResponse, amountData] = await Promise.all([
        api.system.getClassList(),
        api.system.getLoginAmount(),
      ]);
      console.log('Fetched courses response:', coursesResponse); // ⭐ 根據您的回傳格式 {"classes": [...]} 進行修改
      const courseList = coursesResponse.classes || []; // 將資料轉換為 v-select 所需的 { title: string, value: any } 格式 (或 { text: string, value: any }，但 Vuetify 3 建議 title/value)
      courses.value = courseList.map((course) => ({
        title: `${course.name}`,
        value: course.id,
      }));

      console.log('Mapped courses:', courses.value); // 設定預設選中的課程為列表中的第一個項目 (使用 value，即 course.id)
      if (courses.value.length > 0) {
        selectedCourse.value = courses.value[0].value;
      }
      loginAmount.value = amountData.amount || 0;
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  }); // --- Methods ---

  const handleLogin = async () => {
    // ... (其餘 handleLogin 邏輯不變)
    if (!form.value || !(await form.value.validate())) return;

    loading.value = true;
    loginError.value = null;

    try {
      await api.auth.login({
        username: username.value,
        password: password.value,
        classname: selectedCourse.value,
      });

      if (savePassword.value) {
        // 檢查瀏覽器是否支援 Credential Management API
        if ('credentials' in navigator) {
          try {
            const newCredential = new PasswordCredential({
              id: username.value,
              password: password.value,
              name: username.value,
            });
            await navigator.credentials.store(newCredential);
            console.log('Credential stored successfully.');
          } catch (e) {
            console.error('Error storing credential:', e);
          }
        }
      }

      router.push('/dashboard');
    } catch (error) {
      loginError.value = t('login.invalidCredentials');
      console.error('Login failed:', error);
    } finally {
      loading.value = false;
    }
  };

  const toggleTheme = () => {
    theme.global.name.value = isDark.value ? 'light' : 'dark';
  };

  const toggleLanguage = () => {
    locale.value = locale.value === 'en' ? 'zh-TW' : 'en';
  };
</script>

<style scoped>
  .login-container {
    min-height: 100vh;
    --color-1: #fbc2eb;
    --color-2: #a6c1ee;
    --color-3: #84fab0;
    --color-4: #8fd3f4;
    background: linear-gradient(
      -45deg,
      var(--color-1),
      var(--color-2),
      var(--color-3),
      var(--color-4)
    );
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    transition: background 0.5s ease-in-out;
  }
  .v-theme--dark .login-container {
    --color-1: #232526;
    --color-2: #414345;
    --color-3: #0f2027;
    --color-4: #2c5364;
  }
  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  .login-card {
    background: rgba(var(--v-theme-surface), 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(var(--v-border-color), 0.15);
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2), 0px 0px 20px -5px rgba(var(--v-theme-primary), 0.3);
    animation: fadeInScale 0.7s ease-out forwards;
    opacity: 0;
    transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;
  }
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .form-field :deep(.v-label) {
    font-weight: 500;
    opacity: 1;
  }
  .form-field :deep(input) {
    font-weight: 500;
  }
  .form-field :deep(.v-select__selection-text) {
    font-weight: 500;
  }
</style>
