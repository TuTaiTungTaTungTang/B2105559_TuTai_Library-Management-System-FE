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
            <v-icon icon="mdi-shape-plus" color="teal darken-1" style="font-size: 28px;"></v-icon> &nbsp;
            <span style="font-size: 20px; font-weight: bold; color: #37474f;">Quản lý thể loại</span>
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
            <v-btn
                color="teal darken-1"
                elevation="10"
                class="ml-4"
                style="border-radius: 50%; height: 48px; width: 48px;"
                @click="openCreateDialog"
            >
                <v-icon color="white" style="font-size: 24px;">mdi-plus</v-icon>
            </v-btn>
        </v-card-title>

        <v-divider></v-divider>
        <v-data-table
            :headers="headers"
            v-model:search="search"
            :items="items"
            hover
            class="elevation-2"
            style="border-radius: 8px; overflow: hidden; background-color: #f9f9f9;"
        >
            <template v-slot:item.index="{ index }">
                <span style="font-weight: bold; color: teal;">{{ index + 1 }}</span>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-btn
                    elevation="8"
                    size="small"
                    color="blue darken-2"
                    @click="openDialog(item)"
                    style="margin-right: 8px;"
                >
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
                <span style="font-weight: bold; font-size: 18px;">Tạo thể loại mới</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-form>
                    <v-text-field v-model="newItem.MATHELOAI" label="Mã thể loại" required></v-text-field>
                    <v-text-field v-model="newItem.TENTHELOAI" label="Tên thể loại" required></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="closeCreateDialog">Hủy</v-btn>
                <v-btn color="green darken-2" text @click="createCategory">Tạo</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title>
                <span style="font-weight: bold; font-size: 18px;">Chỉnh sửa thể loại</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-form>
                    <v-text-field v-model="editedItem.MATHELOAI" label="Mã thể loại"></v-text-field>
                    <v-text-field v-model="editedItem.TENTHELOAI" label="Tên thể loại"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="closeDialog">Hủy</v-btn>
                <v-btn color="blue darken-2" text @click="saveItem">Lưu</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" persistent max-width="400px">
        <v-card>
            <v-card-title class="headline" style="font-weight: bold; font-size: 18px;">
                Xác nhận xóa thể loại
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="font-size: 16px; color: #455a64;">
                Bạn có chắc muốn xóa thể loại này? Hành động này sẽ không thể hoàn tác.
            </v-card-text>
            <v-card-actions>
                <v-btn color="red darken-1" elevation="5" text @click="closeDeleteDialog">Hủy</v-btn>
                <v-btn color="green darken-2" elevation="5" text @click="confirmDelete">Xóa</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>



<script lang="ts">
import { defineComponent } from 'vue';
import categoryService from '~/services/category.service';
// import { VSonner, toast } from 'vuetify-sonner'
import 'vuetify-sonner/style.css'
import type { Librarian } from '~/models/librarian';
import authService from '~/services/auth.service';
import tokenService from '~/services/token.service';
interface Category {
    _id: string,
    MATHELOAI: string,
    TENTHELOAI: string,
}
export default defineComponent({
    data() {
        return {
            search: '',
            currentUser: {} as Librarian,
            items: [] as Category[],
            dialog: false,
            createDialog: false,
            deleteDialog: false,
            editedItem: {} as Category,
            newItem: {} as Category,
            headers: [
                { title: 'STT', value: 'index', width: 'auto', align: 'center' },
                { key: 'MATHELOAI', title: 'Mã thể loại', width: 'auto', align: 'center' },
                { key: 'TENTHELOAI', title: 'Tên thể loại', width: 'auto', align: 'center' },
                { key: 'actions', title: 'Hành động', align: 'center' }, // Thêm dòng này
            ],
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
            this.newItem = { MATHELOAI: '', TENTHELOAI: '' }; // Reset the form
            this.createDialog = true;
        },
        closeCreateDialog() {
            this.createDialog = false;
        },
        async createCategory() {
            if (this.newItem.MATHELOAI && this.newItem.TENTHELOAI) {
                await categoryService.createCategory(this.newItem.MATHELOAI, this.newItem.TENTHELOAI);
                this.closeCreateDialog();
                this.items = await categoryService.getAllCategory(); // Refresh the list
            } else {
                alert("All fields are required."); // Simple validation feedback
            }
        },
        openDialog(item: Category) {
            this.editedItem = { ...item };
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
        },

        async saveItem() {
            const res = await categoryService.updateCategory(this.editedItem);
            // // @ts-expect-error
            // toast(res.message, {
            //   cardProps: {
            //     color: 'success',
            //     class: 'my-toast',
            //   },
            //   prependIcon: 'mdi-check-circle-outline',
            // })
            this.items = await categoryService.getAllCategory(); // Refresh list
            this.closeDialog();
        },

        openDeleteDialog(item: Category) {
            this.currentItem = item;
            this.deleteDialog = true;
        },
        closeDeleteDialog() {
            this.deleteDialog = false;
        },
        async confirmDelete() {
            console.log("delete")
            await categoryService.deleteCategory(this.currentItem._id);
            this.closeDeleteDialog();
            this.items = await categoryService.getAllCategory(); // Refresh the list
        },
    },

    async mounted() {
        try {
            this.currentUser = await authService.auth()
            alert(this.currentUser.HOTENNV)
        } catch (error) {
            useRouter().push({
                path: "/"
            })
        }
        console.log("Hello")
        this.items = await categoryService.getAllCategory()
        console.log(this.items)
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
