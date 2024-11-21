<template>
    <div>
        <VForm class="login-form" @submit="deleteBook">
            <VImg class="mx-auto my-6" max-width="228" src="/assets/logo.png"></VImg>

            <VCard class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
                <div class="text-subtitle-1 text-medium-emphasis">Bạn có chắc muốn xóa quyển sách "{{ book.TENSACH }}"?
                </div>
                <VBtn block class="mb-8" color="blue" size="large" variant="tonal" type="submit">
                    Đồng ý
                </VBtn>


            </VCard>
            <VSonner />
        </VForm>
    </div>
</template>
<script setup lang="ts">
import bookService from '~/services/book.service';
import { VSonner, toast } from 'vuetify-sonner'
import 'vuetify-sonner/style.css'
const router = useRoute()
const r = useRouter()
const book = await bookService.getBookInfor(router.params.id as string)
async function deleteBook(event: Event) {
    event.preventDefault()
    try {
        const res = await bookService.deleteBook(router.params.id as string)
        // @ts-expect-error
        toast(res.message, {
            cardProps: {
                color: 'success',
                class: 'my-toast',
            },
            prependIcon: 'mdi-check-circle-outline',
        })

        r.push({
            path: "/books/listed"
        }
        )
    } catch (error) {

    }
}
</script>