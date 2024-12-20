<template>
    <div style="margin-bottom: 70px;">
        <v-app-bar app color="teal darken-1" dark dense>
            <VBtn style="font-weight: 500; font-size: large; margin: 0 10px;" :href="`/loanrecord`">QUẢN LÝ MƯỢN SÁCH</VBtn>
            <VBtn style="font-weight: 500; font-size: large; margin: 0 10px;" :href="`/books`">QUẢN LÝ SÁCH</VBtn>
            <VBtn style="font-weight: 500; font-size: large; margin: 0 10px;" :href="`/category`">QUẢN LÝ THỂ LOẠI</VBtn>
            <VBtn style="font-weight: 500; font-size: large; margin: 0 10px;" :href="`/publisher`">QUẢN LÝ NHÀ XUẤT BẢN</VBtn>
            <v-spacer></v-spacer>
            <div style="margin-right: 20px; font-size: medium; font-weight: bold;">Xin chào: {{ currentUser.HOTENNV }}</div>
            <v-btn icon @click="logout" style="margin-right: 10px;">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
    </div>

    <v-card flat>
        <v-card-title class="d-flex align-center pe-2" style="padding-top: 16px; padding-bottom: 16px;">
            <v-icon icon="mdi-note" color="teal darken-1" style="font-size: 28px;"></v-icon> &nbsp;
            <span style="font-size: 20px; font-weight: bold; color: #37474f;">Quản lý phiếu mượn sách</span>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                density="compact"
                label="Tìm kiếm"
                prepend-inner-icon="mdi-magnify"
                outlined
                flat
                hide-details
                style="max-width: 300px;"
            ></v-text-field>
        </v-card-title>

        <v-divider></v-divider>
        <v-data-table
            :headers="headers"
            :items="filteredItems"
            hover
            class="elevation-2"
            style="border-radius: 8px; overflow: hidden; background-color: #f9f9f9;"
        >
            <template v-slot:item.index="{ index }">
                <span style="font-weight: bold; color: teal;">{{ index + 1 }}</span>
            </template>

            <template v-slot:item.DOCGIA="{ item }">
                <div>
                    <strong>{{ item.DOCGIA.TEN }}</strong> ({{ item.DOCGIA.MADOCGIA }})
                </div>
            </template>
            <template v-slot:item.SACH="{ item }">
                <div>{{ item.SACH.TENSACH }}</div>
            </template>

            <template v-slot:item.NGAYMUON="{ item }">
                <div>{{ formatDate(item.NGAYMUON) }}</div>
            </template>
            <template v-slot:item.NGAYTRA="{ item }">
                <div>{{ formatDate(item.NGAYTRA) }}</div>
            </template>

            <template v-slot:item.TRANGTHAI="{ item }">
                <div>
                    <v-chip
                        :color="(item.TRANGTHAI == 0) ? 'brown' : (item.TRANGTHAI == 1) ? '#8B8000' : (item.TRANGTHAI == 2 ? 'green' : 'red')"
                        :text="(item.TRANGTHAI == 0) ? 'Chờ lấy sách' : (item.TRANGTHAI == 1) ? 'Đang mượn' : (item.TRANGTHAI == 2 ? 'Đã trả' : 'Quá hạn')"
                        class="text-uppercase" size="small" label
                    ></v-chip>
                </div>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-btn
                    v-if="item.TRANGTHAI !== 2"
                    elevation="10"
                    size="small"
                    icon
                    @click="openDialog(item)"
                    style="margin-right: 8px;"
                    color="teal"
                >
                    <v-icon color="white">mdi-pencil</v-icon>
                </v-btn>
            </template>
        </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title>
                <span style="font-weight: bold; font-size: 18px;">Chỉnh sửa phiếu mượn</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-form>
                    <v-select v-model="tmp_select" label="Trạng thái" :items="l" required></v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="closeDialog">Hủy</v-btn>
                <v-btn color="green darken-2" text @click="saveItem">Lưu</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Publisher } from '../../models/publisher'
import type { Book } from '~/models/book';
import type { Category } from '~/models/category';
import authService from '~/services/auth.service';
import tokenService from '~/services/token.service';
import type { Librarian } from '~/models/librarian';
import type { LoanRecord } from '~/models/loanrecord';
import loanreccordService from '~/services/loanreccord.service';
import categoryService from '~/services/category.service';
import publisherService from '~/services/publisher.service';

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
            editedItem: {} as LoanRecord,
            newItem: {} as Book,
            tmpImage: null,
            detailsDialog: false,
            dialog: false,
            currentItem: null,
            currentUser: {} as Librarian,
            tmp_select: '',
            l: ['Chờ lấy sách', 'Đang mượn', 'Đã trả', 'Quá hạn'],
            headers: [
                { title: 'STT', value: 'index', width: 'auto', align: 'center' },
                { key: 'DOCGIA', title: 'Tên độc giả', width: 'auto', align: 'center' },
                { key: 'SACH', title: 'Tên sách', width: 'auto', align: 'center' },
                { key: 'NGAYMUON', title: 'Ngày mượn', width: 'auto', align: 'center' },
                { key: 'NGAYTRA', title: 'Ngày trả', width: 'auto', align: 'center' },
                { key: 'TRANGTHAI', title: 'Trạng thái', width: 'auto', align: 'center' },
                { key: 'actions', title: 'Hành động', width: 'auto', align: 'center' }, // Thêm dòng này
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

        openDialog(item: LoanRecord) {
            this.editedItem = { ...item };
            this.tmp_select = this.l[item.TRANGTHAI];
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
        },

        async saveItem() {
            const tmp = this.l.indexOf(this.tmp_select)
            console.log(tmp)
            const res = await loanreccordService.updateLoanRecord(this.editedItem._id, tmp)
            // const res = await publisherService.updatePublisher(this.editedItem);
            // // @ts-expect-error
            // toast(res.message, {
            //   cardProps: {
            //     color: 'success',
            //     class: 'my-toast',
            //   },
            //   prependIcon: 'mdi-check-circle-outline',
            // })
            this.items = await loanreccordService.getAllLoanRecord()
            this.closeDialog();
        },
    },

    async mounted() {
        try {
            this.currentUser = await authService.auth()
            // alert(this.currentUser.HOTENNV)
        } catch (error) {
            alert(error)
            await useRouter().push({
                path: "/"
            })
        }
        console.log("Hello")
        this.items = await loanreccordService.getAllLoanRecord()
        console.log(this.items)
        this.listCategory = await categoryService.getAllCategory()
        this.listCategoryName = this.listCategory.map(category => category.TENTHELOAI)
        this.listPublisher = await publisherService.getAllPublisher()
        this.listPublisherName = this.listPublisher.map(publisher => publisher.TENNXB)
    }
});
</script>

<style scoped>
/* Bố cục */
.v-card-title {
    display: flex;
    align-items: center;
    padding: 8px 16px;
}

/* Tìm kiếm */
.v-text-field {
    max-width: 300px;
}

/* Nút thêm */
.v-btn {
    transition: background-color 0.2s ease;
}

.v-btn:hover {
    background-color: #004d40 !important;
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

/* Bảng */
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
</style>
