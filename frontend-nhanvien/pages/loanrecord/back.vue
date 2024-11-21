<template>
    <div style="margin-bottom: 70px;">
        <v-app-bar app color="primary" dark>
            <!-- <v-btn :href="`/books/listed`">Manage Books</v-btn> -->
            <VBtn :href="`/loanrecord`">QUẢN LÝ MƯỢN SÁCH</VBtn>
            <VBtn :href="`/books`">QUẢN LÝ SÁCH</VBtn>
            <VBtn :href="`/category`">QUẢN LÝ THỂ LOẠI</VBtn>
            <VBtn :href="`/publisher`">QUẢN LÝ NHÀ XUẤT BẢN</VBtn>
            <v-spacer></v-spacer>

            <div style="margin-right: 20px;"> Xin chào: {{ currentUser.HOTENNV }}</div>

            <v-btn icon @click="logout">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
            <!-- <v-btn text @click="navigate('manage-categories')">Manage Categories</v-btn>
              <v-btn text @click="navigate('manage-publishers')">Manage Publishers</v-btn> -->
        </v-app-bar>
    </div>
    <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-note"></v-icon> &nbsp;
            Quản lý phiếu mượn sách

            <v-spacer></v-spacer>
            <v-text-field v-model="search" density="compact" label="Tìm kiếm" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-card-title>


        <v-divider></v-divider>
        <v-data-table :headers="headers" :items="filteredItems" hover="true">
            <template v-slot:item.index="{ index }">
                <span>{{ index + 1 }}</span> <!-- Adding 1 because index starts at 0 -->
            </template>

            <template v-slot:item.DOCGIA="{ item }">
                <div>
                    <strong>{{ item.DOCGIA.TEN }}</strong> ({{ item.DOCGIA.MADOCGIA }})
                </div>
            </template>
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
                <div>
                    <v-chip
                        :color="(item.TRANGTHAI == 0) ? 'brown' : (item.TRANGTHAI == 1) ? '#8B8000' : (item.TRANGTHAI == 2 ? 'green' : 'red')"
                        :text="(item.TRANGTHAI == 0) ? 'Chờ lấy sách' : (item.TRANGTHAI == 1) ? 'Đang mượn' : (item.TRANGTHAI == 2 ? 'Đã trả' : 'Quá hạn')"
                        class="text-uppercase" size="small" label></v-chip>
                </div>
            </template>

            <template v-slot:item.actions="{ item }">

                <v-btn v-if="item.TRANGTHAI !== 2" elevation="10" size="small" icon @click="openDialog(item)"
                    style="margin-right: 8px;">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <!-- <v-btn elevation="10" size="small" icon color="red" @click="openDeleteDialog(item)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn> -->
            </template>
        </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title>
                Chỉnh sửa nhà xuất bản
            </v-card-title>
            <v-card-text>
                <v-form>
                    <VSelect v-model="tmp_select" label="Trạng thái" :items=l required>
                    </VSelect>
                    <!-- <v-text-field v-model="editedItem.TRANGTHAI" label="Mã nhà xuất bản"></v-text-field> -->
                    <!-- <v-text-field v-model="editedItem.TENNXB" label="Tên nhà xuất bản"></v-text-field> -->
                    <!-- <v-text-field v-model="editedItem.DIACHI" label="Địa chỉ"></v-text-field> -->
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDialog">Hủy</v-btn>
                <v-btn color="blue darken-1" text @click="saveItem">Lưu</v-btn>
            </v-card-actions>
        </v-card>
        <!-- <VSonner /> -->
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
:deep() .v-table .v-table__wrapper>table>thead>tr>th:not(:last-child) {
    border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep() .v-table .v-table__wrapper>table>tbody>tr>td:not(:last-child),
.v-table .v-table__wrapper>table>tbody>tr>th:not(:last-child) {
    border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>