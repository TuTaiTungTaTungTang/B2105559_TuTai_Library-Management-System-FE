<template>
  <div>
    <VForm class="login-form" @submit="login">
      <VImg class="mx-auto my-6" max-width="228" src="/assets/logo.png"></VImg>

      <VCard class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
        <div class="text-subtitle-1 text-medium-emphasis">MSNV</div>

        <VTextField density="compact" placeholder="Nhập mã số nhân viên" prepend-inner-icon="mdi-email-outline" variant="outlined"
          v-model="MSNV"></VTextField>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Mật khẩu
        </div>

        <VTextField :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'" :type="visible ? 'text' : 'password'"
          density="compact" placeholder="Nhập mât khẩu" prepend-inner-icon="mdi-lock-outline" variant="outlined"
          @click:append-inner="toggleVisibility" v-model="MATKHAU"></VTextField>

        <VBtn block class="mb-8" color="blue" size="large" variant="tonal" type="submit">
          Đăng nhập
        </VBtn>


      </VCard>
      <VSonner />
    </VForm>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, defineExpose } from 'vue'
const visible = ref(false)

const toggleVisibility = () => {
  visible.value = !visible.value
}

defineExpose({ visible, toggleVisibility })

import authService from '~/services/auth.service';
import { VSonner, toast } from 'vuetify-sonner'
// Required for snackbar background and text color
import 'vuetify-sonner/style.css'
import tokenService from '~/services/token.service';
import { useUserStore } from '~/store/user';
const MSNV = ref("")
const MATKHAU = ref("")
const userStore = useUserStore()
const router = useRouter()
async function login(event: Event) {
  event.preventDefault()
  console.log("Fuck")
  try {
    const res = await authService.login(MSNV.value, MATKHAU.value)
    tokenService.accessToken = res.accessToken
    const user = await authService.auth()
    userStore.setUser(user)
    router.push({
      path: "/loanrecord"
    })
  } catch (error: any) {
    // @ts-expect-error
    toast(error.message, {
      cardProps: {
        color: 'error',
        class: 'my-toast',
      },
      prependIcon: 'mdi-alert-circle-outline',
    })
  }
  console.log(MSNV.value, MATKHAU.value)
}
</script>