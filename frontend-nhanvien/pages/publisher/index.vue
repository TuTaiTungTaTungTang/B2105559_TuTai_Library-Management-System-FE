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
            <span style="font-size: 20px; font-weight: bold; color: #37474f;">Danh sách nhà xuất bản</span>
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
                <span style="font-weight: bold; font-size: 18px;">Tạo nhà xuất bản mới</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-form>
                    <v-text-field v-model="newItem.MANXB" label="Mã nhà xuất bản" required></v-text-field>
                    <v-text-field v-model="newItem.TENNXB" label="Tên nhà xuất bản" required></v-text-field>
                    <v-text-field v-model="newItem.DIACHI" label="Địa chỉ" required></v-text-field>
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
                <span style="font-weight: bold; font-size: 18px;">Chỉnh sửa nhà xuất bản</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-form>
                    <v-text-field v-model="editedItem.MANXB" label="Mã nhà xuất bản"></v-text-field>
                    <v-text-field v-model="editedItem.TENNXB" label="Tên nhà xuất bản"></v-text-field>
                    <v-text-field v-model="editedItem.DIACHI" label="Địa chỉ"></v-text-field>
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
                Xác nhận xóa nhà xuất bản
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="font-size: 16px; color: #455a64;">
                Bạn có chắc muốn xóa nhà xuất bản này? Hành động này sẽ không thể hoàn tác.
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
import type { Publisher } from '../../models/publisher'
import publisherService from '~/services/publisher.service';
import authService from '~/services/auth.service';
import tokenService from '~/services/token.service';
import type { Librarian } from '~/models/librarian';
export default defineComponent({
    data() {
        return {
            search: '',
            items: [] as Publisher[],
            currentUser: {} as Librarian,
            dialog: false,
            createDialog: false,
            deleteDialog: false,
            editedItem: {} as Publisher,
            newItem: {} as Publisher,
            headers: [
                { title: 'STT', value: 'index', width: 'auto', align: 'center'},
                { key: 'MANXB', title: 'Mã nhà xuất bản', width: 'auto', align: 'center' },
                { key: 'TENNXB', title: 'Tên nhà xuất bản', width: 'auto', align: 'center' },
                { key: 'DIACHI', title: 'Địa chỉ' , width: 'auto', align: 'center' },
                { key: 'actions', title: 'Hành động', width: 'auto', align: 'center' }, // Thêm dòng này
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
            this.newItem = {MANXB: '', TENNXB: '', DIACHI: '' }; // Reset the form
            this.createDialog = true;
        },
        closeCreateDialog() {
            this.createDialog = false;
        },
        async createCategory() {
            if (this.newItem.MANXB && this.newItem.TENNXB && this.newItem.DIACHI) {
                console.log(this.newItem)
                await publisherService.createPublisher(this.newItem.MANXB, this.newItem.TENNXB, this.newItem.DIACHI)
                this.closeCreateDialog();
                this.items = await publisherService.getAllPublisher()
            } else {
                alert("All fields are required."); // Simple validation feedback
            }
        },
        openDialog(item: Publisher) {
            this.editedItem = { ...item };
            this.dialog = true;
        },
        closeDialog() {
            this.dialog = false;
        },

        async saveItem() {
            const res = await publisherService.updatePublisher(this.editedItem);
            // // @ts-expect-error
            // toast(res.message, {
            //   cardProps: {
            //     color: 'success',
            //     class: 'my-toast',
            //   },
            //   prependIcon: 'mdi-check-circle-outline',
            // })
            this.items = await publisherService.getAllPublisher()
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
            await publisherService.deletePublisher(this.currentItem._id);
            this.closeDeleteDialog();
            this.items = await publisherService.getAllPublisher()
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
        this.items = await publisherService.getAllPublisher()
        console.log(this.items)
    }
});
</script>

<style scoped>
/* Style tweaks based on previous design */
.v-btn {
    transition: background-color 0.3s ease;
}

.v-btn:hover {
    background-color: #004d40 !important;
}

.v-data-table {
    background-color: #f9f9f9;
}

.v-data-table-header th {
    background-color: #e8f5e9;
    font-weight: bold;
}

.v-table .v-table__wrapper>table>tbody>tr:hover {
    background-color: #e0f7fa !important;
}
</style>
