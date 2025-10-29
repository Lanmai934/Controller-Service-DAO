<template>
  <div class="users">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            添加用户
          </el-button>
        </div>
      </template>
      
      <div class="users-content">
        <!-- 搜索栏 -->
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户..."
            style="width: 300px"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button @click="loadUsers" :loading="userStore.loading">刷新</el-button>
        </div>
        
        <!-- 用户表格 -->
        <el-table
          :data="filteredUsers"
          v-loading="userStore.loading"
          style="width: 100%"
          stripe
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="role" label="角色" />
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="editUser(scope.row)">
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="deleteUser(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    
    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingUser ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" type="email" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.role" style="width: 100%">
            <el-option label="用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="saveUser" :loading="saving">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

// 使用 Pinia store
const userStore = useUserStore()

// 响应式数据
const saving = ref(false)
const searchQuery = ref('')
const showAddDialog = ref(false)
const editingUser = ref(null)

// 用户表单
const userForm = ref({
  name: '',
  email: '',
  username: '',
  role: 'user'
})

// 计算属性
const filteredUsers = computed(() => {
  return userStore.searchUsers(searchQuery.value)
})

// 方法
const loadUsers = async () => {
  try {
    await userStore.fetchUsers()
  } catch (error) {
    // 错误已在 store 中处理
  }
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = { ...user }
  showAddDialog.value = true
}

const saveUser = async () => {
  saving.value = true
  try {
    if (editingUser.value) {
      // 编辑用户
      await userStore.updateUser(editingUser.value.id, userForm.value)
    } else {
      // 添加用户
      await userStore.createUser(userForm.value)
    }
    
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    // 错误已在 store 中处理
  } finally {
    saving.value = false
  }
}

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await userStore.deleteUser(user.id)
  } catch (error) {
    if (error !== 'cancel') {
      // 错误已在 store 中处理
    }
  }
}

const resetForm = () => {
  userForm.value = {
    name: '',
    email: '',
    username: '',
    role: 'user'
  }
  editingUser.value = null
}

// 生命周期
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.users {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.users-content {
  padding: 20px 0;
}
</style>