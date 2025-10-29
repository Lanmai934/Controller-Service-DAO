<template>
  <div class="loading-spinner" :class="{ 'full-screen': fullScreen }">
    <div class="spinner-container">
      <el-icon class="is-loading" :size="size">
        <Loading />
      </el-icon>
      <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'

defineProps({
  size: {
    type: Number,
    default: 24
  },
  text: {
    type: String,
    default: ''
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.loading-spinner.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.spinner-container {
  text-align: center;
}

.loading-text {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}

.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>