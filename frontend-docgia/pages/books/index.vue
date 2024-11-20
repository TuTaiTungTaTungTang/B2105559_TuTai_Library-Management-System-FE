<template>
    <div style="margin-bottom: 70px;">
        <v-app-bar app color="primary" dark>
            <VBtn style="font-weight: 300; font-size: large;" :href="`/books`">SÁCH</VBtn>
            <VBtn style="font-weight: 300; font-size: large;" :href="`/loanrecord`">PHIẾU MƯỢN SÁCH</VBtn>

            <v-spacer></v-spacer>

            <div style="margin-right: 20px;"> Xin chào: {{ currentUser.TEN }}</div>

            <v-btn icon @click="logout">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
    </div>
    <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-book"></v-icon> &nbsp;
            Sách

            <v-spacer></v-spacer>
            <v-text-field v-model="search" density="compact" label="Tìm kiếm" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-card-title>

        <v-divider></v-divider>
        <v-data-table :headers="headers" :items="filteredItems" hover="true">
            <template v-slot:item.index="{ index }">
                <span>{{ index + 1 }}</span> <!-- Adding 1 because index starts at 0 -->
            </template>

            <template v-slot:item.HINHANH="{ item }">
                <v-card class="my-2" elevation="2" rounded>
                    <v-img :src="`http://localhost:3000/statics/${item.HINHANH}`"
                        style="object-fit: cover; display: block; width: 100%; height:50%;"></v-img>
                </v-card>
            </template>

            <template v-slot:item.THELOAI="{ item }">
                <div>{{ item.THELOAI.TENTHELOAI }}</div>
            </template>

            <template v-slot:item.NHAXUATBAN="{ item }">
                <div>{{ item.NHAXUATBAN.TENNXB }}</div>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-btn elevation="10" size="small" icon @click="openDetailsDialog(item)" style="margin-right: 8px;">
                    <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn elevation="10" size="small" icon color="blue" @click="openBorrowDialog(item)">
                    <v-icon>mdi-book-plus</v-icon>
                </v-btn>
            </template>
        </v-data-table>
    </v-card>

    <v-dialog v-model="detailsDialog" max-width="800px" max-height="800px">
        <v-card>
            <v-card-title>
                Chi tiết sách
            </v-card-title>
            <v-card-text class="d-flex">
                <v-img :src="`http://localhost:3000/statics/${currentItem.HINHANH}`" class="ma-3" width="50%"
                    style="max-height: 800px; object-fit: contain;"></v-img>
                <div>
                    <div><strong>Tên sách:</strong> {{ currentItem.TENSACH }}</div>
                    <div><strong>Thể loại:</strong> {{ currentItem.THELOAI.TENTHELOAI }}</div>
                    <div><strong>Đơn giá:</strong> {{ currentItem.DONGIA }}</div>
                    <div><strong>Số quyển:</strong> {{ currentItem.SOQUYEN }}</div>
                    <div><strong>Năm xuất bản:</strong> {{ currentItem.NAMXUATBAN }}</div>
                    <div><strong>Nhà xuất bản:</strong> {{ currentItem.NHAXUATBAN.TENNXB }}</div>
                    <div><strong>Tác giả:</strong> {{ currentItem.TACGIA }}</div>
                    <div><strong>Mô tả:</strong> {{ currentItem.MOTA }}</div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="detailsDialog = false">Đóng</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="borrowDialog" max-width="500px">
        <v-card>
            <v-card-title>
                Xác nhận mượn sách
            </v-card-title>
            <v-card-text>
                Bạn có muốn mượn quyển sách này không?
            </v-card-text>
            <v-card-actions>
                <v-btn color="green darken-1" text @click="confirmBorrow()">Xác nhận</v-btn>
                <v-btn color="red darken-1" text @click="borrowDialog = false">Hủy</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Book } from '~/models/book';
import bookService from '~/services/book.service';
import loanrecordService from '~/services/loanrecord.service';
import authService from '~/services/auth.service';
import tokenService from '~/services/token.service';
import type { Member } from '~/models/member';
export default defineComponent({
    data() {
        return {
            search: '',
            items: [] as Book[],
            borrowDialog: false,
            detailsDialog: false,
            currentItem: null,
            currentUser: {} as Member,
            headers: [
                { title: 'STT', value: 'index', width: 'auto', align: 'center' },
                { key: 'HINHANH', title: 'Hình ảnh', width: '120px', align: 'center' },
                { key: 'TENSACH', title: 'Tên sách', width: 'auto', align: 'center' },
                { key: 'THELOAI', title: 'Thể loại', width: 'auto', align: 'center' },
                { key: 'SOQUYEN', title: 'Số quyển', width: 'auto', align: 'center' },
                { key: 'NAMXUATBAN', title: 'Năm xuất bản', width: 'auto', align: 'center' },
                { key: 'NHAXUATBAN', title: 'Nhà xuất bản', width: 'auto', align: 'center' },
                { key: 'TACGIA', title: 'Tác giả', width: 'auto', align: 'center' },
                { key: 'actions', title: 'Hành động', align: 'center' }, // Thêm dòng này
            ],
        }
    },

    computed: {
        filteredItems() {
            console.log("Items:", this.items); // Kiểm tra xem có items nào không
            const filtered = this.items.filter((item) => {
                return (item.TENSACH.toLowerCase().includes(this.search.toLowerCase()) ||
                    item.NHAXUATBAN.TENNXB.toLowerCase().includes(this.search.toLowerCase()) ||
                    item.THELOAI.TENTHELOAI.toLowerCase().includes(this.search.toLowerCase()) ||
                    item.TACGIA.toLowerCase().includes(this.search.toLowerCase()));
            });
            console.log("Filtered Items:", filtered); // Xem kết quả của bộ lọc
            return filtered;
        }
    },
    methods: {
        logout() {
            tokenService.removeAccessToken()
            useRouter().push({
                path: "/"
            })
        },
        openDetailsDialog(item) {
            this.currentItem = item;
            this.detailsDialog = true;
        },
        openBorrowDialog(item) {
            this.currentItem = item;
            this.borrowDialog = true;
        },
        
        async confirmBorrow() {
            // Calculate today's date
            const today = new Date();
            // Calculate the date one month from today
            const oneMonthFromToday = new Date(today);
            oneMonthFromToday.setMonth(today.getMonth() + 1);
            await loanrecordService.loanBook(this.currentUser._id, this.currentItem._id, today, oneMonthFromToday)
            this.items = await bookService.listAllBooks()
            this.borrowDialog = false;
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
        this.items = await bookService.listAllBooks()
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