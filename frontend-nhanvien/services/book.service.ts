import createHttp from "~/http/createHttp";
import type { Book } from "~/models/book";
import type { Category } from "~/models/category";
import type { Publisher } from "~/models/publisher";
// import type { Publisher } from "~/models/publisher";

class PublisherService {
    constructor(private readonly http=createHttp("book")){}
    async createBook(
        TENSACH: string, 
        THELOAI: string,
        DONGIA: number,
        SOQUYEN: number,
        NAMXUATBAN: number,
        NHAXUATBAN: string,
        TACGIA: string,
        MOTA: string,
        HINHANH: string
    ) {
        return (await this.http.post("/", {
            TENSACH,
            THELOAI,
            DONGIA,
            SOQUYEN,
            NAMXUATBAN,
            NHAXUATBAN,
            TACGIA,
            MOTA,
            HINHANH
        }))
    }

    async listAllBooks(): Promise<Array<Book>>{
        return (await this.http.get("/"))
    }

    async getBookInfor(id: string): Promise<Book>{
        return (await this.http.get(`/id/${id}`))
    }

    // async updateBook(p0: string, p1: { TENSACH: string; THELOAI: Category; DONGIA: number; SOQUYEN: number; NAMXUATBAN: number; NHAXUATBAN: Publisher; TACGIA: string; MOTA: string; HINHANH: string; }, book: Book){
    //     return (await this.http.put(`/`, book))
    // }
    async updateBook(
        id: string, // Book ID
        updatedData: {
            TENSACH: string;
            THELOAI: string; // The ID of the category
            DONGIA: number;
            SOQUYEN: number;
            NAMXUATBAN: number;
            NHAXUATBAN: string; // The ID of the publisher
            TACGIA: string;
            MOTA: string;
            HINHANH?: string; // Optional, only if an image is uploaded
        }
    ) {
        return this.http.put(`/${id}`, updatedData) // Send the PUT request to `/api/book/:id`
            .then(response => response.data)
            .catch(error => {
                console.error("Error updating book:", error.response?.data || error.message);
                throw error;
            });
    }

    async deleteBook(id: string){
        return (await this.http.delete(`/${id}`))
    }
}

export default new PublisherService()