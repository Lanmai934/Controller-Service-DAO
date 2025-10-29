<template>
  <div class="error-boundary">
    <div v-if="hasError" class="error-container">
      <el-result
        icon="error"
        title="出现了一些问题"
        :sub-title="errorMessage"
      >
        <template #extra>
          <el-button type="primary" @click="retry">重试</el-button>
          <el-button @click="goHome">返回首页</el-button>
        </template>
      </el-result>
    </div>
    <slot v-else />
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const hasError = ref(false)
const errorMessage = ref('')

const emit = defineEmits(['error', 'retry'])

onErrorCaptured((error, instance, info) => {
  console.error('Error captured:', error, info)
  
  hasError.value = true
  errorMessage.value = error.message || '未知错误'
  
  emit('error', { error, instance, info })
  
  // 阻止错误继续传播
  return false
})

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  emit('retry')
  ElMessage.success('正在重试...')
}

const goHome = () => {
  router.push('/')
}

// 暴露方法供父组件调用
defineExpose({
  retry,
  clearError: () => {
    hasError.value = false
    errorMessage.value = ''
  }
})
</script>

<style scoped>
.error-boundary {
  width: 100%;
  height: 100%;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 20px;
}
</style>