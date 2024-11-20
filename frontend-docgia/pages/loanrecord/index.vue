<template>
    <div style="margin-bottom: 70px;">
        <v-app-bar app color="primary" dark>
            <!-- <v-btn :href="`/books/listed`">Manage Books</v-btn> -->
            <VBtn style="font-weight: 300; font-size: large;" :href="`/books`">SÁCH</VBtn>
            <VBtn style="font-weight: 300; font-size: large;" :href="`/loanrecord`">PHIẾU MƯỢN SÁCH</VBtn>
            <!-- <v-btn text @click="navigate('manage-categories')">Manage Categories</v-btn>
              <v-btn text @click="navigate('manage-publishers')">Manage Publishers</v-btn> -->
            <!-- Spacer to push content to the right -->
            <v-spacer></v-spacer>

            <!-- Displaying the user's name -->
            <div style="margin-right: 20px;"> Xin chào: {{ currentUser.TEN }}</div>

            <!-- Logout Button -->
            <v-btn icon @click="logout">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
    </div>
    <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-note"></v-icon> &nbsp;
            Phiếu mượn sách của {{ currentUser.TEN }}

            <v-spacer></v-spacer>
            <v-text-field v-model="search" density="compact" label="Tìm kiếm" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-card-title>


        <v-divider></v-divider>
        <v-data-table :headers="headers" :items="filteredItems" hover="true">
            <template v-slot:item.index="{ index }">
                <span>{{ index + 1 }}</span> <!-- Adding 1 because index starts at 0 -->
            </template>

            <!-- <template v-slot:item.DOCGIA="{ item }">
                <div>
                    <strong>{{ item.DOCGIA.TEN }}</strong> ({{ item.DOCGIA.MADOCGIA }})
                </div>
            </template> -->
            <template v-slot:item.SACH="{ item }">
                <div>{{ item.SACH.TENSACH }}</div>
                <!-- <span>{{ index + 1 }}</span> -->
            </template>

            <template v-slot:item.NGAYMUON="{ item }">
                <div>{{ formatDate(item.NGAYMUON) }}</div>
            </template>
            <template v-slot:item.NGAYTRA="{ item }">
                <div>{{ formatDate(item.NGAYTRA) }}</div>
            </template>

            <template v-slot:item.TRANGTHAI="{ item }">
                <div >
                    <v-chip :color="(item.TRANGTHAI == 0) ? 'brown' : (item.TRANGTHAI == 1) ? '#8B8000': (item.TRANGTHAI == 2 ? 'green' : 'red')" 
                    :text="(item.TRANGTHAI == 0) ? 'Chờ lấy sách' : (item.TRANGTHAI == 1) ? 'Đang mượn': (item.TRANGTHAI == 2 ? 'Đã trả' : 'Quá hạn')"
                        class="text-uppercase" size="small" label></v-chip>
                </div>
            </template>
            

        </v-data-table>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import categoryService from '~/services/category.service';
import type { Publisher } from '../../models/publisher'
import type { Book } from '~/models/book';
import publisherService from '~/services/publisher.service';
import bookService from '~/services/book.service';
import uploadService from '~/services/upload.service';
import type { Category } from '~/models/category';
import loanrecordService from '~/services/loanrecord.service';
import authService from '~/services/auth.service';
import tokenService from '~/services/token.service';
import type { Member } from '~/models/member';
import type { LoanRecord } from '~/models/loanrecord';

export default defineComponent({
    data() {
        return {
            listCategory: [] as Category[],
            listCategoryName: [] as string[],
            listPublisher: [] as Publisher[],
            listPublisherName: [] as string[],
            search: '',
            items: [] as LoanRecord[],
            returnBookDialog: false,
            editedItem: {} as Book,
            newItem: {} as Book,
            tmpImage: null,
            detailsDialog: false,
            currentItem: null,
            currentUser: {} as Member,
            headers: [
                { title: 'STT', value: 'index', width: 'auto', align: 'center' },
                // { key: 'DOCGIA', title: 'Tên độc giả', width: 'auto', align: 'center' },
                { key: 'SACH', title: 'Tên sách', width: 'auto', align: 'center' },
                { key: 'NGAYMUON', title: 'Ngày mượn', width: 'auto', align: 'center' },
                { key: 'NGAYTRA', title: 'Ngày trả', width: 'auto', align: 'center' },
                { key: 'TRANGTHAI', title: 'Trạng thái', width: 'auto', align: 'center' },
            ],
        }
    },

    computed: {
        filteredItems() {
            console.log("Items:", this.items); // Kiểm tra xem có items nào không
            const filtered = this.items.filter((item) => {
                return (item.SACH.TENSACH.toLowerCase().includes(this.search.toLowerCase()));
            });
            console.log("Filtered Items:", filtered); // Xem kết quả của bộ lọc
            return filtered;
        }
    },
    methods: {
        formatDate(date) {
            if (!date) return '';
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return new Intl.DateTimeFormat('vi-VN', options).format(new Date(date));
        },
        
        logout() {
            tokenService.removeAccessToken()
            useRouter().push({
                path: "/"
            })
        },
    },

    async mounted() {
        try {
            this.currentUser = await authService.auth()
        } catch (error) {
            await useRouter().push({
                path: "/"
            })
        }
        console.log("Hello")
        this.items = await loanrecordService.getLoanRecord(this.currentUser._id)
        console.log(this.items)
        this.listCategory = await categoryService.getAllCategory()
        this.listCategoryName = this.listCategory.map(category => category.TENTHELOAI)
        this.listPublisher = await publisherService.getAllPublisher()
        this.listPublisherName = this.listPublisher.map(publisher => publisher.TENNXB)
    }
});
</script>

<style scoped>
:deep() .v-table .v-table__wrapper>table>thead>tr>th:not(:last-child) {
    border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep() .v-table .v-table__wrapper>table>tbody>tr>td:not(:last-child),
.v-table .v-table__wrapper>table>tbody>tr>th:not(:last-child) {
    border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>