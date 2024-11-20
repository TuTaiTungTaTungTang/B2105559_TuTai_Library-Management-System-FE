<template>
  <div>
    <VForm class="register-form" @submit="register">
      <VImg class="mx-auto my-6" max-width="228" src="/assets/logo.png"></VImg>

      <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
        <div class="text-subtitle-1 text-medium-emphasis">Mã độc giả</div>

        <v-text-field v-model="MADOCGIA" density="compact" placeholder="Nhập mã độc giả"
          variant="outlined"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Họ lót
        </div>

        <v-text-field v-model="HOLOT" density="compact" placeholder="Nhập họ lót" variant="outlined"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Tên
        </div>

        <v-text-field v-model="TEN" density="compact" placeholder="Nhập tên" variant="outlined"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Ngày sinh
        </div>

        <v-date-picker v-model="NGAYSINH" title="" evation="24">
          <template v-slot:header>
            <!-- Empty slot to remove header content -->
          </template>
        </v-date-picker>
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Giới tính
        </div>
        <VSelect v-model="PHAI" density="compact" placeholder="Chọn thể loại" :items="['Nam', 'Nữ']" variant="outlined">

        </VSelect>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Địa chỉ
        </div>

        <v-text-field v-model="DIACHI" density="compact" placeholder="Nhập địa chỉ" variant="outlined"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Số điện thoại
        </div>

        <v-text-field v-model="SODIENTHOAI" density="compact" placeholder="Nhập số điện thoại"
          variant="outlined"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
        </div>

        <v-text-field v-model="MATKHAU" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline" variant="outlined"
          @click:append-inner="visible = !visible"></v-text-field>

        <v-btn block class="mb-8" color="blue" size="large" variant="tonal" type="submit">
          Đăng ký
        </v-btn>

        <v-card-text class="text-center">
          <a class="text-blue text-decoration-none" href="/" rel="noopener noreferrer" target="_blank">
            Bạn đã có tài khoản? Đăng nhập ngay <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text>
      </v-card>
    </VForm>
  </div>
</template>
<script setup lang="ts">
import { defineComponent } from 'vue';
import { ref, defineProps, defineExpose } from 'vue'
const visible = ref(false)

const toggleVisibility = () => {
  visible.value = !visible.value
}

defineExpose({ visible, toggleVisibility })
import authService from '~/services/auth.service';
import tokenService from '~/services/token.service';
import { useUserStore } from '~/store/user';
const MADOCGIA = ref("")
const HOLOT = ref("")
const TEN = ref("")
const NGAYSINH = ref()
const PHAI = ref("")
const DIACHI = ref("")
const SODIENTHOAI = ref("")
const MATKHAU = ref("")
const router = useRouter()
async function register(event: Event) {
  event.preventDefault()
  console.log("Fuck")
  try {
    const res = await authService.reg(MADOCGIA.value,
      MATKHAU.value, HOLOT.value, TEN.value, NGAYSINH.value, PHAI.value, DIACHI.value, SODIENTHOAI.value,
      'reg'
    )
    console.log("chuyen")
    router.push({
      path: "/"
    })
  } catch (error) {

  }
}
</script>
