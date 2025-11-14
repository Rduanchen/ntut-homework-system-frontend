<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="pa-4 pa-sm-8" max-width="400" variant="flat">
          <v-card-title class="text-h5 font-weight-bold text-center mb-6">
            <v-icon icon="mdi-lock-reset" class="mr-2" size="large"></v-icon>
            更改密碼
          </v-card-title>

          <v-form @submit.prevent="handleChangePassword" ref="formRef" :disabled="isLoading">
            <v-text-field
              v-model="oldPassword"
              :rules="[requiredRule]"
              :type="showOldPassword ? 'text' : 'password'"
              :append-inner-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showOldPassword = !showOldPassword"
              label="舊密碼"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="newPassword"
              :rules="[requiredRule, passwordMatchRule]"
              :type="showNewPassword ? 'text' : 'password'"
              :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showNewPassword = !showNewPassword"
              label="新密碼"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="confirmPassword"
              :rules="[requiredRule, passwordMatchRule]"
              :type="showNewPassword ? 'text' : 'password'"
              label="確認新密碼"
              variant="outlined"
              density="comfortable"
              class="mb-6"
            ></v-text-field>

            <v-alert
              v-if="feedbackMessage"
              :type="isSuccess ? 'success' : 'error'"
              variant="tonal"
              class="mb-6"
              closable
              @click:close="clearFeedback"
            >
              {{ feedbackMessage }}
            </v-alert>

            <v-btn
              type="submit"
              :loading="isLoading"
              color="primary"
              block
              size="large"
              class="text-body-1"
            >
              更改
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  // 假設您在 '@/utilities/api' 中導出了 API 實例
  import api from '@/utilities/api';
  // 匯入 ChangePasswordRequest 介面
  import type { ChangePasswordRequest } from '@/utilities/api'; // 請確保路徑正確

  const router = useRouter();
  // --- 狀態管理 ---
  const formRef = ref<any>(null);
  const oldPassword = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const isLoading = ref(false);
  const showOldPassword = ref(false);
  const showNewPassword = ref(false);

  // 狀態回饋
  const feedbackMessage = ref('');
  const isSuccess = ref(false);

  const clearFeedback = () => {
    feedbackMessage.value = '';
    isSuccess.value = false;
  };

  // --- 驗證規則 (Validation Rules) ---
  const requiredRule = (value: string) => !!value || '此欄位為必填。';
  // minLengthRule 已被移除
  const passwordMatchRule = (value: string) =>
    value === newPassword.value || '新密碼和確認密碼不一致。';

  // --- 處理密碼更改邏輯 ---
  const handleChangePassword = async () => {
    clearFeedback();
    isLoading.value = true;

    // 1. 執行 Vuetify 表單驗證
    const { valid } = await formRef.value.validate();
    if (!valid) {
      isLoading.value = false;
      return;
    }

    // 2. 構建請求數據
    const requestData: ChangePasswordRequest = {
      oldpassword: oldPassword.value,
      newpassword: newPassword.value,
    };

    // 3. 呼叫 API
    try {
      await api.auth.changePassword(requestData);

      // 成功處理
      isSuccess.value = true;
      feedbackMessage.value = '密碼更改成功！請使用新密碼登入。';

      // 可選：成功後清空表單
      oldPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      formRef.value.resetValidation();
      // 延遲五秒
      setTimeout(() => {
        router.push('/login');
      }, 4000);
    } catch (error: any) {
      // 錯誤處理
      isSuccess.value = false;
      // 嘗試從 API 錯誤響應中獲取具體訊息，否則使用預設訊息
      const errorMessage = error.response?.data?.message || '密碼更改失敗，請檢查舊密碼是否正確。';
      feedbackMessage.value = errorMessage;
      console.error('Change password failed:', error);
    } finally {
      isLoading.value = false;
    }
  };
</script>

<style scoped>
  /* 這裡可以添加任何額外的 CSS 樣式 */
</style>
