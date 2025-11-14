<template>
  <v-card
    class="upload-box"
    :class="uploadBoxClasses"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <div v-if="isDragging" class="drag-overlay">
      <v-icon size="64">mdi-cloud-upload-outline</v-icon>
      <div class="mt-2">{{ t('uploadComponent.dropFile') }}</div>
    </div>

    <v-container :class="{ 'pa-2': isDragging }">
      <v-row align="center" no-gutters>
        <v-col cols="auto" class="mr-4">
          <v-sheet
            class="upload-status-icon d-flex align-center justify-center"
            :color="statusColor"
            rounded="lg"
            elevation="2"
          >
            <v-icon color="white" size="28">{{ statusIcon }}</v-icon>
          </v-sheet>
        </v-col>

        <v-col class="py-2">
          <div class="text-subtitle-1 text-medium-emphasis">[Description]</div>
          <div class="text-caption text-disabled">[deadline]</div>
        </v-col>

        <v-col cols="auto">
          <v-btn
            :disabled="!props.isAllowUpload"
            variant="flat"
            class="mr-2"
            :color="props.isAllowUpload ? 'grey-lighten-2' : 'red-lighten-2'"
            @click="openCodeDialog"
          >
            [upload text]
          </v-btn>

          <v-btn
            :disabled="!props.isAllowUpload"
            variant="flat"
            :color="props.isAllowUpload ? 'grey-lighten-2' : 'red-lighten-2'"
            @click="triggerFileUpload"
          >
            [upload file]
          </v-btn>
          <input
            ref="fileInputRef"
            type="file"
            style="display: none"
            @change="handleFileSelect"
            :accept="fileAccept"
          />
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="codeDialog" max-width="800">
      <v-card>
        <v-card-title class="headline"
          >{{ t('uploadComponent.pasteCode') }} ({{ codeExtension }})</v-card-title
        >
        <v-card-text>
          <v-textarea
            v-model="codeInput"
            :label="t('uploadComponent.pasteCodeLabel')"
            rows="15"
            variant="outlined"
            placeholder="// 例如：console.log('Hello World');"
            auto-grow
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="codeDialog = false">取消</v-btn>
          <v-btn color="primary" variant="flat" @click="uploadCode">轉換為檔案並上傳</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="warningDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline text-red-darken-2">警告：檔案將被覆蓋！</v-card-title>
        <v-card-text>
          您已上傳過作業 **({{ uploadedFileName }})**。
          繼續操作將會覆蓋舊檔案。您確定要上傳新檔案嗎？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="cancelUpload">取消</v-btn>
          <v-btn color="red-darken-2" variant="flat" @click="confirmUpload">確定覆蓋</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="successDialog" max-width="400">
      <v-card>
        <v-card-title class="headline text-green-darken-2">上傳成功！</v-card-title>
        <v-card-text class="d-flex align-center">
          <v-icon color="green-darken-2" class="mr-2">mdi-check-circle</v-icon>
          檔案已成功上傳！
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="successDialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const props = defineProps({
    puzzleID: {
      type: [String, Number],
      required: true,
    },
    language: {
      type: String,
      default: 'text', // 預設為一般文字
      validator: (value) => ['python', 'cpp', 'c', 'js', 'text'].includes(value.toLowerCase()),
    },
    isAllowUpload: {
      type: Boolean,
      default: true,
    },
  });

  // --- 狀態管理 ---
  const isDragging = ref(false); // 拖曳中狀態
  const codeDialog = ref(false); // 程式碼輸入 Dialog 狀態
  const warningDialog = ref(false); // 覆蓋警告 Dialog 狀態
  const successDialog = ref(false); // 上傳成功 Dialog 狀態
  const fileInputRef = ref(null); // 檔案輸入框的 DOM 引用
  const codeInput = ref(''); // 程式碼輸入框的內容
  const uploadedFileName = ref(null); // 模擬已上傳的檔案名稱 (用於警告提示)
  const uploadQueueBlob = ref(null); // 儲存準備上傳的 Blob 物件

  // --- Computed 屬性 ---

  // 1. isUploaded() 模擬方法
  const isUploaded = computed(() => {
    // 這裡使用 localStorage 檢查是否有該 puzzleID 的上傳記錄
    return localStorage.getItem(`upload_file_${props.puzzleID}`) !== null;
  });

  // 2. 左側 Icon
  const statusIcon = computed(() => {
    if (!props.isAllowUpload) {
      return 'mdi-cancel';
    }
    return isUploaded.value ? 'mdi-check-bold' : 'mdi-upload';
  });

  // 3. 左側底色
  const statusColor = computed(() => {
    if (!props.isAllowUpload) {
      return 'red'; // 禁止上傳：紅色
    }
    return isUploaded.value ? 'green' : 'grey'; // 已上傳：綠色, 未上傳：灰色
  });

  // 4. 整體元件 Class
  const uploadBoxClasses = computed(() => ({
    'disabled-upload': !props.isAllowUpload,
    'dragging-over': isDragging.value,
  }));

  // 5. 程式碼檔案副檔名
  const codeExtension = computed(() => {
    const lang = props.language.toLowerCase();
    switch (lang) {
      case 'python':
        return '.py';
      case 'cpp':
        return '.cpp';
      case 'c':
        return '.c';
      case 'js':
        return '.js';
      default:
        return '.txt';
    }
  });

  // 6. 檔案選擇器可接受的檔案類型
  const fileAccept = computed(() => {
    const lang = props.language.toLowerCase();
    switch (lang) {
      case 'python':
        return '.py, text/x-python';
      case 'cpp':
        return '.cpp, .cc, .cxx, text/x-c++src';
      case 'c':
        return '.c, text/x-csrc';
      case 'js':
        return '.js, text/javascript';
      default:
        return '*/*';
    }
  });

  // --- 程式碼輸入 (Upload Text) 邏輯 ---

  /**
   * 取得 localStorage 的 key
   */
  const getLocalStorageKey = () => `code_text_${props.puzzleID}`;

  /**
   * 打開程式碼輸入 Dialog，並從 localStorage 載入資料
   */
  const openCodeDialog = () => {
    if (!props.isAllowUpload) return;
    const savedCode = localStorage.getItem(getLocalStorageKey());
    if (savedCode) {
      codeInput.value = savedCode;
    }
    codeDialog.value = true;
  };

  /**
   * 儲存程式碼到 localStorage
   */
  watch(codeInput, (newVal) => {
    // 只有在 Dialog 開啟時才持續儲存，避免初始化時觸發
    if (codeDialog.value) {
      localStorage.setItem(getLocalStorageKey(), newVal);
    }
  });

  /**
   * 將程式碼內容轉換為 Blob 並準備上傳
   */
  const uploadCode = async () => {
    if (!codeInput.value) {
      alert('程式碼內容不能為空！');
      return;
    }

    // 1. 關閉 Dialog
    codeDialog.value = false;

    // 2. 轉換為 Blob 物件
    const blob = new Blob([codeInput.value], { type: 'text/plain' });
    // 這裡給予一個虛擬的檔案名稱，用於提示
    const fileName = `code_upload_${props.puzzleID}${codeExtension.value}`;

    // 3. 執行上傳前檢查
    await prepareUpload(blob, fileName);
  };

  // --- 檔案選擇 (Upload File) 邏輯 ---

  /**
   * 點擊按鈕觸發隱藏的檔案選擇框
   */
  const triggerFileUpload = () => {
    if (!props.isAllowUpload) return;
    fileInputRef.value.click();
  };

  /**
   * 處理檔案選擇框的變動事件
   */
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // 執行上傳前檢查
      await prepareUpload(file, file.name);
    }
    // 清空 value，以便使用者可以選擇同一個檔案再次上傳
    event.target.value = '';
  };

  // --- 拖曳上傳 (Drag and Drop) 邏輯 ---

  const handleDragOver = () => {
    if (!props.isAllowUpload) return;
    isDragging.value = true;
  };

  const handleDragLeave = () => {
    if (!props.isAllowUpload) return;
    isDragging.value = false;
  };

  const handleDrop = async (event) => {
    if (!props.isAllowUpload) {
      isDragging.value = false;
      return;
    }

    isDragging.value = false;
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];
      // 執行上傳前檢查
      await prepareUpload(file, file.name);
    }
  };

  // --- 上傳核心邏輯 (包含警告) ---

  /**
   * 準備上傳，檢查是否需要顯示覆蓋警告
   * @param {Blob} blob - 準備上傳的 Blob 或 File 物件
   * @param {string} fileName - 檔案名稱
   */
  const prepareUpload = async (blob, fileName) => {
    uploadQueueBlob.value = blob;
    uploadedFileName.value = fileName; // 儲存檔名用於警告提示

    if (isUploaded.value) {
      // 顯示警告 Dialog
      warningDialog.value = true;
    } else {
      // 沒有上傳過，直接執行上傳
      await confirmUpload();
    }
  };

  /**
   * 取消上傳動作
   */
  const cancelUpload = () => {
    warningDialog.value = false;
    uploadQueueBlob.value = null;
    uploadedFileName.value = null;
    // 如果是 drag & drop，這裡可能需要額外清理狀態
  };

  /**
   * 確認上傳，呼叫 toUpload 方法
   */
  const confirmUpload = async () => {
    warningDialog.value = false;
    if (uploadQueueBlob.value) {
      // 呼叫預留的 toUpload 方法
      const success = await toUpload(uploadQueueBlob.value);

      if (success) {
        // 模擬上傳成功後更新狀態，並清空暫存
        // 這裡需要模擬實際的 isUploaded 狀態更新，例如：
        localStorage.setItem(`upload_file_${props.puzzleID}`, uploadedFileName.value);

        // 顯示成功提示
        successDialog.value = true;
      }

      // 清空隊列
      uploadQueueBlob.value = null;
      uploadedFileName.value = null;
    }
  };

  // --- 對外暴露的方法 (使用者要求預留) ---

  /**
   * **預留方法**：執行上傳 API 的實際操作
   * @param {Blob} blob - 待上傳的 Blob 物件 (來自檔案或文字轉換)
   * @returns {Promise<boolean>} - 模擬 API 上傳結果
   */
  const toUpload = async (blob) => {
    // TODO:
    // 1. 在此處實作呼叫您的上傳 API (e.g., Axios.post('/api/upload', formData))
    // 2. 您需要根據您的 API 要求，將 Blob 放入 FormData 中

    console.log('--- 執行 toUpload 預留方法 ---');
    console.log(`Puzzle ID: ${props.puzzleID}`);
    console.log(`Blob Type: ${blob.type}`);
    console.log(`Blob Size: ${blob.size} bytes`);
    console.log('--- 上傳 API 實作處 ---');

    // 模擬 API 呼叫延遲
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 模擬 API 成功回傳
    return true;
  };

  // 將 computed 屬性或方法暴露給父元件
  defineExpose({
    isUploaded, // 已實作的計算屬性
    toUpload, // 預留的 API 呼叫方法
  });
</script>

<style scoped>
  .upload-box {
    border: 1px solid rgba(0, 0, 0, 0.12); /* 輕微邊框 */
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.3s, border-color 0.3s;
  }

  .upload-box.disabled-upload {
    opacity: 0.7;
    pointer-events: none; /* 禁用滑鼠事件 */
    cursor: not-allowed;
  }

  .upload-status-icon {
    width: 48px;
    height: 48px;
  }

  /* 拖曳特效 */
  .drag-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(66, 165, 245, 0.9); /* 淺藍色半透明 */
    border: 4px dashed #fff;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }

  .upload-box.dragging-over {
    box-shadow: 0 0 10px 5px rgba(66, 165, 245, 0.5);
  }
</style>
