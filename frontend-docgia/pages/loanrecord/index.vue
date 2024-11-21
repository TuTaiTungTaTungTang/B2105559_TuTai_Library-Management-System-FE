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
/* Tổng quan */
v-card {
    border-radius: 12px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Phần bảng */
.v-data-table {
    background-color: #f9f9f9;
    border-radius: 8px;
}

.v-data-table thead {
    background-color: #4caf50;
    color: white;
    font-weight: bold;
}

.v-data-table tbody tr {
    transition: background-color 0.3s ease;
}

.v-data-table tbody tr:hover {
    background-color: #e8f5e9;
}

/* Phần chip trạng thái */
.v-chip {
    font-size: 0.9em;
    text-transform: capitalize;
    color: white;
}

.v-chip.brown {
    background-color: #795548;
}

.v-chip.green {
    background-color: #388e3c;
}

.v-chip.yellow {
    background-color: #fbc02d;
}

.v-chip.red {
    background-color: #d32f2f;
}

/* Thanh tìm kiếm */
.v-text-field {
    max-width: 300px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề */
.v-card-title {
    font-size: 1.4em;
    font-weight: bold;
    color: #4caf50;
    margin-bottom: 10px;
}

/* App bar */
.v-app-bar {
    background-color: #4caf50;
}

.v-btn {
    font-size: 1em;
    margin: 0 8px;
    color: white;
    text-transform: none;
}

.v-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

/* Spacer chỉnh cân đối */
.v-spacer {
    flex-grow: 1;
}

/* Phần padding */
.v-card {
    padding: 16px;
}

</style>