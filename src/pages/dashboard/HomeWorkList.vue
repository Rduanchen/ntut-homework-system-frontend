<template>
  <div>
    <Homework
      v-for="(homework, index) in homeworkList"
      :key="index"
      :id="index"
      :title="homework.title"
      :deadline="homework.deadline"
      :language="homework.language"
      :status="homework.status"
      :icon="homework.icon"
    />
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import api from '@/utilities/api';
  import { useI18n } from 'vue-i18n';
  import Homework from '@/components/HomeWork.vue';

  console.log('HomeWorkList component mounted.');
  // classId: 0
  // deadline: "2025-12-31T23:59:59Z"
  // filename: "CS1_001.txt"
  // id: 0
  // language: "python"
  // title: "Sample Puzzle"  

  onMounted(async () => {
    let homeworkList = await api.homework.getHomeworkList();
    console.log(homeworkList.homeworkList);
    // Sort by deadline ascending, unfinished first
    let finedList = [];
  });

  const homeworkList = ref<any[]>([
    {
      id: 1,
      title: '第一週：Node.js 基礎 API 設計',
      deadline: '2025-12-31T23:59:59Z',
      language: 'TypeScript',
      status: 'Submitted',
    },
    {
      id: 2,
      title: '第二週：資料庫連線與 ORM 實作',
      deadline: '2025-11-22T23:59:00Z',
      language: 'JavaScript',
      status: 'Grading',
    },
    {
      id: 3,
      title: '第三週：機器學習模型部署作業',
      deadline: '2025-10-28T23:59:00Z',
      language: 'Python',
      status: 'Overdue',
    },
    {
      id: 4,
      title: '第四週：使用 C# 實作微服務架構',
      deadline: '2025-12-06T23:59:00Z',
      language: 'C#',
      status: '',      
    },
    {
      id: 5,
      title: '期末專題：Java 後端服務整合',
      deadline: '2025-12-30T12:00:00Z',
      language: 'Java',
      status: '',      
    },
  ]);
</script>
