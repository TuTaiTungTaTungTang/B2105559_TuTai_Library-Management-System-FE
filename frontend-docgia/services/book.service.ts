import createHttp from "~/http/createHttp";
import type { Book } from "~/models/book";
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

    async updateBook(book: Book){
        return (await this.http.put(`/`, book))
    }

    async deleteBook(id: string){
        return (await this.http.delete(`/${id}`))
    }
}

export default new PublisherService()