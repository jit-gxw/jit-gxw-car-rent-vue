// useLogout.js
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/store/token'
import { useCurrentUserDataStore } from '@/store/currentUser'
import { ElMessage } from 'element-plus'
import { loginOutService } from '@/api/employee'

export function useLogout() {
  const router = useRouter()
  const tokenStore = useTokenStore()
  const currentUserDataStore = useCurrentUserDataStore()

  const logout = async () => {
    try {
      await loginOutService()
      tokenStore.removeToken()
      currentUserDataStore.removeCurrentUserData()
      ElMessage.success('登出成功')
      router.push('/login')
    } catch (err) {
      ElMessage.error('登出失败')
    }
  }

  return { logout }
}