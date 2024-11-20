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
            <v-icon icon="mdi-book"></v-icon> &nbsp;
            Quản lý sách
        </v-card-title>
        <v-card-title class="d-flex align-center pe-2">
            <VBtn style="margin-left: 10px; margin-bottom: 10px;" color="primary" icon="mdi-plus" elevation="10"
                @click="openCreateDialog"></VBtn>
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
                <!-- <img :src="uploadService.getFileUrl(item.HINHANH)"
                            style="object-fit: cover; display: block; width: 100%; height:90%;"></img> -->
            </template>
            <template v-slot:item.THELOAI="{ item }">
                <div>{{ item.THELOAI.TENTHELOAI }}</div>
                <!-- <span>{{ index + 1 }}</span> -->
            </template>
            <template v-slot:item.NHAXUATBAN="{ item }">
                <div>{{ item.NHAXUATBAN.TENNXB }}</div>
                <!-- <span>{{ index + 1 }}</span> -->
            </template>
            <template v-slot:item.actions="{ item }">

                <v-btn elevation="10" size="small" icon @click="openDialog(item)" style="margin-right: 8px;">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn elevation="10" size="small" icon color="red" @click="openDeleteDialog(item)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>

        </v-data-table>
    </v-card>
    <v-dialog v-model="createDialog" max-width="600px">
        <v-card>
            <v-card-title>
                Thêm sách
            </v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field v-model="newItem.TENSACH" label="Tên sách" required></v-text-field>
                    <VSelect v-model="newItem.THELOAI.TENTHELOAI" label="Thể loại" :items=listCategoryName required>
                    </VSelect>
                    <VSelect v-model="newItem.THELOAI.TENTHELOAI" label="Thể loại" :items=listCategoryName required>
                    </VSelect>
                    <v-text-field v-model="newItem.DONGIA" type="number" label="Đơn giá" required></v-text-field>
                    <v-text-field v-model="newItem.SOQUYEN" type="number" label="Số quyển" required></v-text-field>
                    <v-text-field v-model="newItem.NAMXUATBAN" type="number" label="Năm xuất bản"
                        required></v-text-field>
                    <VSelect v-model="newItem.NHAXUATBAN.TENNXB" type="number" label="Nhà xuất bản"
                        :items=listPublisherName required></VSelect>
                    <v-text-field v-model="newItem.TACGIA" label="Tác giả" required></v-text-field>
                    <VTextarea v-model="newItem.MOTA" label="Mô tả" required></VTextarea>
                    <VFileInput v-model="tmpImage" label="Hình ảnh minh họa" required></VFileInput>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeCreateDialog">Hủy</v-btn>
                <v-btn color="blue darken-1" text @click="createCategory">Thêm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title>
                Chỉnh sửa sách
            </v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field v-model="editedItem.TENSACH" label="Tên sách" required></v-text-field>
                    <VSelect v-model="editedItem.THELOAI.TENTHELOAI" label="Thể loại" :items=listCategoryName required>
                    </VSelect>
                    <v-text-field v-model="editedItem.DONGIA" type="number" label="Đơn giá" required></v-text-field>
                    <v-text-field v-model="editedItem.SOQUYEN" type="number" label="Số quyển" required></v-text-field>
                    <v-text-field v-model="editedItem.NAMXUATBAN" type="number" label="Năm xuất bản"
                        required></v-text-field>
                    <VSelect v-model="editedItem.NHAXUATBAN.TENNXB" type="number" label="Nhà xuất bản"
                        :items=listPublisherName required></VSelect>
                    <v-text-field v-model="editedItem.TACGIA" label="Tác giả" required></v-text-field>
                    <VTextarea v-model="editedItem.MOTA" label="Mô tả" required></VTextarea>
                    <VFileInput v-model="tmpImage" label="Hình ảnh minh họa"></VFileInput>
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

    <v-dialog v-model="deleteDialog" persistent max-width="400px">
        <v-card>
            <v-card-title class="headline">Xác nhận xóa sách</v-card-title>
            <v-card-text>
                Bạn có chắc muốn xóa quyển sách này? Hành động này sẽ không thể hoàn tác.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDeleteDialog">Hủy</v-btn>
                <v-btn color="red darken-1" text @click="confirmDelete">Xóa</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import categoryService from '~/services/category.service';
// import { VSonner, toast } from 'vuetify-sonner'
import 'vuetify-sonner/style.css'
import type { Publisher } from '../../models/publisher'
import type { Book } from '~/models/book';
import publisherService from '~/services/publisher.service';
import bookService from '~/services/book.service';
import CategoryService from '~/services/category.service';
import PublisherService from '~/services/publisher.service';
import uploadService from '~/services/upload.service';
import type { Category } from '~/models/category';
import type { Librarian } from '~/models/librarian';
import authService from '~/services/auth.service';
import tokenService from '~/services/token.service';
// const listCategory = await CategoryService.getAllCategory()
// console.log(listCategory)
// const listCategoryName = listCategory.map(category => category.TENTHELOAI)
// console.log(listCategoryName)
// const listPublisher = await PublisherService.getAllPublisher()
// const listPublisherName = listPublisher.map(publisher => publisher.TENNXB)
// console.log(listPublisher)

export default defineComponent({
    data() {
        return {
            currentUser: {} as Librarian,
            listCategory: [] as Category[],
            listCategoryName: [] as string[],
            listPublisher: [] as Publisher[],
            listPublisherName: [] as string[],
            search: '',
            items: [] as Book[],
            dialog: false,
            createDialog: false,
            deleteDialog: false,
            editedItem: {} as Book,
            newItem: {} as Book,
            tmpImage: null,
            headers: [
                { title: 'STT', value: 'index', width: 'auto', align: 'center' },
                { key: 'HINHANH', title: 'Hình ảnh', width: '120px', align: 'center' },
                { key: 'TENSACH', title: 'Tên sách', width: 'auto', align: 'center' },
                { key: 'THELOAI', title: 'Thể loại', width: 'auto', align: 'center' },
                { key: 'DONGIA', title: 'Đơn giá', width: 'auto', align: 'center' },
                { key: 'SOQUYEN', title: 'Số quyển', width: 'auto', align: 'center' },
                { key: 'NAMXUATBAN', title: 'Năm xuất bản', width: 'auto', align: 'center' },
                { key: 'NHAXUATBAN', title: 'Nhà xuất bản', width: 'auto', align: 'center' },
                { key: 'TACGIA', title: 'Tác giả', width: 'auto', align: 'center' },
                // { key: 'MOTA', title: 'Mô tả', width: '500px', align: 'center' },
                // { key: 'TENNXB', title: 'Tên nhà xuất bản', width: '300px' },
                // { key: 'DIACHI', title: 'Địa chỉ' },
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
        openCreateDialog() {
            this.tmpImage = null;
            this.newItem = {
                TENSACH: '',
                THELOAI: { _id: '', MATL: '', TENTHELOAI: '' },
                DONGIA: 0,
                SOQUYEN: 0,
                NAMXUATBAN: new Date().getFullYear(),
                NHAXUATBAN: { _id: '', MANXB: '', TENNXB: '', DIACHI: '' },
                TACGIA: '',
                MOTA: '',
                HINHANH: '',
            }; // Reset the form
            this.createDialog = true;
        },
        closeCreateDialog() {
            this.createDialog = false;
        },
        async createCategory() {
            // console.log(this.tmpImage)
            const file = await uploadService.uploadImage(this.tmpImage)
            console.log(file.filename)
            const category = this.listCategory.find(category => category.TENTHELOAI === this.newItem.THELOAI.TENTHELOAI);
            const publisher = this.listPublisher.find(publisher => publisher.TENNXB === this.newItem.NHAXUATBAN.TENNXB);
            const res = await bookService.createBook(
                this.newItem.TENSACH,
                category._id,
                this.newItem.DONGIA,
                this.newItem.SOQUYEN,
                this.newItem.NAMXUATBAN,
                publisher._id,
                this.newItem.TACGIA,
                this.newItem.MOTA,
                file.filename
            )
            this.closeCreateDialog();
            this.items = await bookService.listAllBooks()
            // if (this.newItem.MANXB && this.newItem.TENNXB && this.newItem.DIACHI) {
            //     console.log(this.newItem)
            //     await publisherService.createPublisher(this.newItem.MANXB, this.newItem.TENNXB, this.newItem.DIACHI)
            //     this.closeCreateDialog();
            //     this.items = await publisherService.getAllPublisher()
            // } else {
            //     alert("All fields are required."); // Simple validation feedback
            // }
        },
        openDialog(item: Publisher) {
            this.tmpImage = null;
            this.editedItem = { ...item };
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
        },

        async saveItem() {
            const category = this.listCategory.find(category => category.TENTHELOAI === this.editedItem.THELOAI.TENTHELOAI);
            const publisher = this.listPublisher.find(publisher => publisher.TENNXB === this.editedItem.NHAXUATBAN.TENNXB);
            if (!this.tmpImage) {
                console.log("1")
                await bookService.updateBook(this.editedItem)
            }
            else {
                console.log("2")
                const file = await uploadService.uploadImage(this.tmpImage)
                this.editedItem.HINHANH = file.filename;
                await bookService.updateBook(this.editedItem)
            }
            // const res = await publisherService.updatePublisher(this.editedItem);
            // // @ts-expect-error
            // toast(res.message, {
            //   cardProps: {
            //     color: 'success',
            //     class: 'my-toast',
            //   },
            //   prependIcon: 'mdi-check-circle-outline',
            // })
            this.items = await bookService.listAllBooks()
            this.closeDialog();
        },

        openDeleteDialog(item: Publisher) {
            this.currentItem = item;
            this.deleteDialog = true;
        },
        closeDeleteDialog() {
            this.deleteDialog = false;
        },
        async confirmDelete() {
            console.log("delete")
            await bookService.deleteBook(this.currentItem._id);
            this.closeDeleteDialog();
            this.items = await bookService.listAllBooks()
        },
    },

    async mounted() {
        try {
            this.currentUser = await authService.auth()
            // alert(this.currentUser.HOTENNV)
        } catch (error) {
            useRouter().push({
                path: "/"
            })
        }
        console.log("Hello")
        this.items = await bookService.listAllBooks()
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