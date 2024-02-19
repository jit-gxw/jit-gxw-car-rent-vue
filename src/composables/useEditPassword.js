// useLogout.js
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/store/token'
import { useCurrentUserDataStore } from '@/store/currentUser'
import { ElMessage } from 'element-plus'
import { editPassWordService } from '@/api/employee'
import { ref } from 'vue'

export function useEditPassWord() {
  const router = useRouter()
  

  const editPassWord = async (params) => {
    let res=''
      await editPassWordService(params).then((result) => {
        ElMessage.success('修改密码成功，请重新登陆！');
       res=result
      })
      return res
  }

  return { editPassWord }
}