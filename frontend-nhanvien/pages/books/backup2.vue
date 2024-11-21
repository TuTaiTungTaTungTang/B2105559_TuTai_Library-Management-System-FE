<template>
    <div style="margin-bottom: 70px;">
        <v-app-bar app color="teal darken-1" dark dense>
            <VBtn style="font-weight: 400; font-size: large; margin: 0 10px;" :href="`/loanrecord`">QUẢN LÝ MƯỢN SÁCH
            </VBtn>
            <VBtn style="font-weight: 400; font-size: large; margin: 0 10px;" :href="`/books`">QUẢN LÝ SÁCH</VBtn>
            <VBtn style="font-weight: 400; font-size: large; margin: 0 10px;" :href="`/category`">QUẢN LÝ THỂ LOẠI
            </VBtn>
            <VBtn style="font-weight: 400; font-size: large; margin: 0 10px;" :href="`/publisher`">QUẢN LÝ NHÀ XUẤT BẢN
            </VBtn>
            <v-spacer></v-spacer>
            <div style="margin-right: 20px; font-size: medium; font-weight: bold;">Xin chào: {{ currentUser.HOTENNV }}
            </div>
            <v-btn icon @click="logout" style="margin-right: 10px;">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
    </div>

    <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-book" style="color: #2b7a78;"></v-icon> &nbsp;
            <span style="font-weight: bold; font-size: 20px; color: #37474f;">Quản lý sách</span>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" density="compact" label="Tìm kiếm" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line
                style="max-width: 300px; margin-right: 10px;"></v-text-field>
            <VBtn style="margin-left: 10px;" color="teal darken-2" icon="mdi-plus" elevation="8"
                @click="openCreateDialog">
                <v-icon color="white">mdi-plus</v-icon>
            </VBtn>
        </v-card-title>
        <v-divider></v-divider>

        <v-data-table :headers="headers" :items="filteredItems" hover class="elevation-2"
            style="border-radius: 8px; overflow: hidden; background-color: #f9f9f9;">
            <template v-slot:item.index="{ index }">
                <span style="font-weight: bold; color: teal;">{{ index + 1 }}</span>
            </template>

            <template v-slot:item.HINHANH="{ item }">
                <v-card elevation="1" rounded style="border: 1px solid #ddd;">
                    <v-img :src="`http://localhost:3000/statics/${item.HINHANH}`" aspect-ratio="16/9"></v-img>
                </v-card>
            </template>

            <template v-slot:item.THELOAI="{ item }">
                <div style="color: #2b7a78; font-weight: bold;">{{ item.THELOAI.TENTHELOAI }}</div>
            </template>

            <template v-slot:item.NHAXUATBAN="{ item }">
                <div style="color: #3d5af1;">{{ item.NHAXUATBAN.TENNXB }}</div>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-btn elevation="8" size="small" color="blue darken-2" @click="openDialog(item)"
                    style="margin-right: 8px;">
                    <v-icon color="white">mdi-pencil</v-icon>
                </v-btn>
                <v-btn elevation="8" size="small" color="red darken-2" @click="openDeleteDialog(item)">
                    <v-icon color="white">mdi-delete</v-icon>
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

        // async saveItem() {
        //     // 
        //     try {
        //         const category = this.listCategory.find(category => category.TENTHELOAI === this.editedItem.THELOAI.TENTHELOAI);
        //         const publisher = this.listPublisher.find(publisher => publisher.TENNXB === this.editedItem.NHAXUATBAN.TENNXB);

        //         if (!category || !publisher) {
        //             alert("Thể loại hoặc nhà xuất bản không hợp lệ.");
        //             return;
        //         }

        //         // Assign correct IDs to the editedItem
        //         this.editedItem.THELOAI = category._id;
        //         this.editedItem.NHAXUATBAN = publisher._id;

        //         // Handle image upload if a new image is provided
        //         if (this.tmpImage) {
        //             const file = await uploadService.uploadImage(this.tmpImage);
        //             this.editedItem.HINHANH = file.filename;
        //         }

        //         // Send updated book data to the backend
        //         await bookService.updateBook(this.editedItem._id, this.editedItem);


        //         // Refresh the list of books
        //         this.items = await bookService.listAllBooks();

        //         this.closeDialog(); // Close the dialog
        //     } catch (error) {
        //         console.error("Error updating book:", error);
        //         alert("Có lỗi xảy ra khi cập nhật sách."+ error);
        //     }
        // },

        async saveItem() {
            try {
                // Find category and publisher by name
                const category = this.listCategory.find(category => category.TENTHELOAI === this.editedItem.THELOAI.TENTHELOAI);
                const publisher = this.listPublisher.find(publisher => publisher.TENNXB === this.editedItem.NHAXUATBAN.TENNXB);

                if (!category || !publisher) {
                    alert("Thể loại hoặc nhà xuất bản không hợp lệ.");
                    return;
                }

                // Assign correct IDs to the editedItem
                this.editedItem.THELOAI = category._id;
                this.editedItem.NHAXUATBAN = publisher._id;

                // Prepare updated data
                const updatedData = {
                    TENSACH: this.editedItem.TENSACH,
                    THELOAI: this.editedItem.THELOAI,
                    DONGIA: this.editedItem.DONGIA,
                    SOQUYEN: this.editedItem.SOQUYEN,
                    NAMXUATBAN: this.editedItem.NAMXUATBAN,
                    NHAXUATBAN: this.editedItem.NHAXUATBAN,
                    TACGIA: this.editedItem.TACGIA,
                    MOTA: this.editedItem.MOTA,
                };

                // Handle image upload if a new image is provided
                if (this.tmpImage) {
                    const file = await uploadService.uploadImage(this.tmpImage);
                    updatedData.HINHANH = file.filename;
                }

                // Send updated book data to the backend
                await bookService.updateBook(this.editedItem._id, updatedData);

                // Refresh the book list
                this.items = await bookService.listAllBooks();

                // Close the dialog
                this.closeDialog();
                alert("Sách đã được cập nhật thành công.");
            } catch (error) {
                console.error("Error updating book:", error);
                alert("Có lỗi xảy ra khi cập nhật sách: " + error.message);
            }
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
/* Bảng dữ liệu */
.v-data-table {
    border-radius: 10px;
    background-color: #f9f9f9;
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
    background-color: #e0f7fa;
    cursor: pointer;
}

/* Thanh điều hướng */
.v-app-bar {
    font-family: "Roboto", sans-serif;
    font-size: 16px;
}

/* Tiêu đề */
.v-card-title {
    font-size: 20px;
    font-weight: bold;
    color: #37474f;
}

/* Nút thao tác */
.v-btn {
    margin: 5px;
    transition: background-color 0.2s ease;
}

.v-btn:hover {
    background-color: #e0f7fa !important;
}

/* Chỉnh sửa hình ảnh */
.v-img {
    border-radius: 8px;
    object-fit: cover;
}
</style>
