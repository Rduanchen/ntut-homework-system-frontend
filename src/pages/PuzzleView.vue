<template>
  <!-- <div>
    <h2>未上傳，允許上傳 (預設)</h2>
    <UploadFile puzzleID="PZ-001" language="python" :isAllowUpload="true" ref="uploadRef1" />
    <v-btn @click="checkUploadStatus('uploadRef1')">檢查上傳狀態 (PZ-001)</v-btn>

    <h2 class="mt-8">已上傳 (模擬 localStorage 狀態), 允許上傳</h2>
    <UploadFile puzzleID="PZ-002" language="cpp" :isAllowUpload="true" ref="uploadRef2" />

    <h2 class="mt-8">未上傳, 禁止上傳 (紅色/Cancel Icon)</h2>
    <UploadFile puzzleID="PZ-003" language="js" :isAllowUpload="false" ref="uploadRef3" />
  </div> -->
  <markdown-it-vue class="md-body" :content="content" :options="options" />
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import UploadFile from '@/components/UploadFile.vue';

  // 模擬 PZ-002 已經有上傳記錄，讓 isUploaded 預設為 true
  onMounted(() => {
    // 模擬 PZ-002 已經上傳過一個檔案
    localStorage.setItem('upload_file_PZ-002', 'main.cpp');
  });

  const content = ref();

  const backenddMockContent = {
    title: "Sum two numbers",
    puzzleId: "001",
    description:
      " # Sum two numbers\n\nWrite a function that takes two numbers as input and returns their sum.\n\n## Input\n\n- Two integers `a` and `b`.\n\n## Output\n\n- An integer representing the sum of `a` and `b`.\n\n## Example\n\n```\nInput: a = 3, b = 5\nOutput: 8\n```\n\n## Constraints\n\n- -1000 <= a, b <= 1000",
    testCases: [
      { input: "3 5", output: "8" },
      { input: "-2 10", output: "8" },
      { input: "0 0", output: "0" },
    ],
  };

  const uploadRef1 = ref(null);

  const checkUploadStatus = (refName) => {
    const component = eval(refName).value;
    if (component) {
      const status = component.isUploaded ? '已上傳' : '未上傳';
      alert(`元件 ${refName} 的狀態是: ${status}`);
    }
  };
</script>
