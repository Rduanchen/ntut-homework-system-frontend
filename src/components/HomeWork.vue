<template>
  <v-card
    class="assignment-card ma-4"
    variant="outlined"
    rounded="lg"
    :elevation="isHovering ? 8 : 2"
    :class="{ 'card-hover': isHovering }"
    :style="cardStyle"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <v-list-item class="pa-4">
      <template v-slot:prepend>
        <div class="d-flex align-center mr-3">
          <span class="text-h6 font-weight-bold text-primary mr-4 id-number"> #{{ id }} </span>

          <v-sheet
            class="d-flex align-center justify-center"
            :color="statusColor"
            rounded="lg"
            width="48"
            height="48"
            elevation="0"
          >
            <v-icon color="white">{{ icon }}</v-icon>
          </v-sheet>
        </div>
      </template>

      <div>
        <v-list-item-title class="text-h6 font-weight-medium">
          {{ title }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption text-medium-emphasis">
          {{ deadlineString }}
        </v-list-item-subtitle>
      </div>

      <template v-slot:append>
        <div class="d-flex align-center">
          <v-chip
            label
            class="mr-2 px-4 py-3 text-subtitle-2 font-weight-medium"
            color="grey-lighten-2"
            text-color="black"
            variant="flat"
          >
            {{ language }}
          </v-chip>

          <v-chip
            label
            class="px-4 py-3 text-subtitle-2 font-weight-medium"
            :color="statusColor"
            text-color="white"
            variant="flat"
          >
            {{ status? status : 'New' }}
          </v-chip>
        </div>
      </template>
    </v-list-item>
  </v-card>
</template>

<script setup>
  import { computed, ref } from 'vue';

  const props = defineProps({
    id: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: String,
      default: '[Title]',
    },
    deadline: {
      type: String,
      default: '[deadline]',
    },
    language: {
      type: String,
      default: '[language]',
    },
    status: {
      type: String,
      default: '[status]',
    },
  });

  // 1. 響應式變數來追蹤滑鼠是否懸停
  const isHovering = ref(false);

  // 2. 根據 isHovering 狀態計算 style 屬性
  const cardStyle = computed(() => {
    const scale = isHovering.value ? 1.02 : 1; // 放大 2%
    const transition = 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease';

    return {
      transform: `scale(${scale})`,
      transition: transition,
      // 懸停時背景色變為 light-blue-lighten-5 (一個較淺的藍色)
      // backgroundColor: isHovering.value ? 'rgb(227, 242, 253)' : 'white',
      filter: isHovering.value ? 'grayscale(100%)' : 'none',
      cursor: 'pointer', // 增加指標
    };
  });

  const icon = computed(() => {
    switch (String(props.status).toLowerCase()) {
      case 'submitted':
        return 'mdi-check-circle'; // 提交成功 (綠色)
      case 'grading':
        return 'mdi-clock-check-outline'; // 評分中 (藍色)
      case 'overdue':
        return 'mdi-alert-circle'; // 逾期未交 (紅色)
      default:
        return 'mdi-new-box'; // 新作業 (灰色/預設)
    }
  });

  const deadlineString = computed(() => {
    // 將 ISO 字串轉換為 Date 物件
    const date = new Date(props.deadline);
    // 格式化日期為 YYYY/MM/DD HH:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `截止日期: ${year}/${month}/${day} ${hours}:${minutes}`;
  });

  const statusColor = computed(() => {
    switch (String(props.status).toLowerCase()) {
      case 'submitted':
        return 'green-darken-1';
      case 'overdue':
        return 'red-darken-1';
      case 'grading':
        return 'blue-darken-1';
      default:
        return 'grey';
    }
  });
</script>

<style scoped>
  /* 可選：讓 ID 編號的文字顏色更醒目 */
  .id-number {
    /* 這裡使用 Vuetify 的 text-primary 顏色 */
    color: var(--v-theme-primary);
  }
  .assignment-card {
    min-height: 80px;
  }
  /* 調整 v-list-item 的標題/副標題行高 */
  .v-list-item-title {
    line-height: 1.2 !important;
  }
  .v-list-item-subtitle {
    line-height: 1.4 !important;
  }
</style>
