// eslint.config.js (cấu hình mới)
import { defineConfig } from 'eslint-define-config';
import vuePlugin from 'eslint-plugin-vue';  // Nhập plugin vue dưới dạng đối tượng

export default defineConfig([
  {
    plugins: {
      vue: vuePlugin // Định nghĩa plugin dưới dạng đối tượng
    },
    languageOptions: {
      globals: {
        browser: true,
        node: true
      }
    },
    rules: {
     'vue/valid-v-slot': 'error',
    }
  }
]);
