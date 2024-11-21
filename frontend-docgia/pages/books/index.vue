<template>
    <div style="margin-bottom: 70px;">
        <v-app-bar app color="teal darken-1" dark dense>
            <VBtn style="font-weight: 400; font-size: large; margin: 0 10px;" :href="`/books`">SÁCH</VBtn>
            <VBtn style="font-weight: 400; font-size: large; margin: 0 10px;" :href="`/loanrecord`">PHIẾU MƯỢN SÁCH</VBtn>
            <v-spacer></v-spacer>
            <div style="margin-right: 20px; font-size: medium; font-weight: bold;">Xin chào: {{ currentUser.TEN }}</div>
            <v-btn icon @click="logout" style="margin-right: 10px;">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
    </div>
    <!-- Thanh tìm kiếm -->
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-text-field
                    v-model="search"
                    label="Tìm kiếm sách"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    dense
                    hide-details
                ></v-text-field>
            </v-col>
        </v-row>

        <!-- Danh sách sách -->
        <v-row>
            <v-col v-for="(item, index) in paginatedItems" :key="index" cols="12" sm="6" md="4">
                <v-card elevation="2" class="book-card">
                    <v-img :src="`http://localhost:3000/statics/${item.HINHANH}`" class="book-image"></v-img>
                    <v-card-text>
                        <div class="book-title"><strong>{{ item.TENSACH }}</strong></div>
                        <v-spacer></v-spacer>
                        <div class="book-author"><strong>Tác giả:</strong> {{ item.TACGIA }}</div>
                        <div class="book-category"><strong>Thể loại:</strong> {{ item.THELOAI.TENTHELOAI }}</div>
                        <div class="book-price"><strong>Giá:</strong> {{ item.DONGIA.toLocaleString() }} VND</div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn icon color="blue" @click="openDetailsDialog(item)">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        <v-btn icon color="green" @click="openBorrowDialog(item)">
                            <v-icon>mdi-book-plus</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Pagination Controls -->
        <v-pagination
            v-if="filteredItems.length > itemsPerPage"
            v-model="currentPage"
            :length="pageCount"
            class="mt-4"
        ></v-pagination>
    </v-container>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="800px">
        <v-card>
            <v-card-title>Chi tiết sách</v-card-title>
            <v-card-text>
                <v-img :src="`http://localhost:3000/statics/${currentItem.HINHANH}`" class="details-image"></v-img>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <div>
                    <p><strong>Tên sách:</strong> {{ currentItem.TENSACH }}</p>
                    <p><strong>Tác giả:</strong> {{ currentItem.TACGIA }}</p>
                    <p><strong>Thể loại:</strong> {{ currentItem.THELOAI.TENTHELOAI }}</p>
                    <p><strong>Năm xuất bản:</strong> {{ currentItem.NAMXUATBAN }}</p>
                    <p><strong>Nhà xuất bản:</strong> {{ currentItem.NHAXUATBAN.TENNXB }}</p>
                    <p><strong>Mô tả:</strong> {{ currentItem.MOTA }}</p>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn color="blue darken-1" text @click="detailsDialog = false">Đóng</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Borrow Dialog -->
    <v-dialog v-model="borrowDialog" max-width="500px">
        <v-card>
            <v-card-title>Xác nhận mượn sách</v-card-title>
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
            search: '', // Biến lưu giá trị tìm kiếm
            items: [] as Book[], // Danh sách sách
            borrowDialog: false,
            detailsDialog: false,
            currentItem: null as any,
            currentUser: {},
            itemsPerPage: 6, // Số lượng sách hiển thị trên mỗi trang
            currentPage: 1, // Trang hiện tại
        };
    },
    computed: {
        filteredItems() {
            return this.items.filter((item) => {
                return (
                    item.TENSACH.toLowerCase().includes(this.search.toLowerCase()) ||
                    item.TACGIA.toLowerCase().includes(this.search.toLowerCase()) ||
                    item.THELOAI.TENTHELOAI.toLowerCase().includes(this.search.toLowerCase())
                );
            });
        },
        paginatedItems() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredItems.slice(start, end);
        },
        pageCount() {
            return Math.ceil(this.filteredItems.length / this.itemsPerPage);
        },
    },
    methods: {
        logout() {
            tokenService.removeAccessToken()
            useRouter().push({
                path: "/"
            })
        },
        openDetailsDialog(item: Book) {
            this.currentItem = item;
            this.detailsDialog = true;
        },
        openBorrowDialog(item: Book) {
            this.currentItem = item;
            this.borrowDialog = true;
        },
        async confirmBorrow() {
            const today = new Date();
            const returnDate = new Date(today);
            returnDate.setMonth(today.getMonth() + 1);
            await loanrecordService.loanBook(
                this.currentUser._id,
                this.currentItem._id,
                today,
                returnDate
            );
            this.items = await bookService.listAllBooks();
            this.borrowDialog = false;
        },
    },
    async mounted() {
        this.items = await bookService.listAllBooks();
        this.currentUser = await authService.auth();
    },
});
</script>

<style scoped>
/* Định dạng bảng */
.v-data-table {
    border-radius: 10px;
    background-color: #f9f9f9;
    overflow: hidden;
}

.v-data-table-header th {
    font-size: 14px;
    font-weight: 600;
    color: #37474f;
    text-align: center;
    background-color: #e8f5e9;
}

/* Hover từng dòng */
.v-data-table tbody tr:hover {
    background-color: #e0f7fa !important;
    cursor: pointer;
}

/* Nút */
.v-btn {
    transition: background-color 0.2s ease;
    margin: 5px;
}

.v-btn:hover {
    background-color: #e0f7fa !important;
}

/* Dialog */
.v-card-title {
    font-family: "Roboto", sans-serif;
    font-size: 20px;
    font-weight: bold;
    color: #37474f;
}

.v-card-text {
    font-size: 16px;
    color: #455a64;
}
.book-title {
    font-size: 18px; /* Adjust the font size as needed */
    font-weight: bold;
    text-align: center; /* Center the text */
    color: #2b7a78; /* Optional: Change the color to match the theme */
    margin-bottom: 8px; /* Optional: Add spacing below the title */
}
</style>
