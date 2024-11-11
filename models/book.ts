import type { Category } from "./category"
import type { Publisher } from "./publisher"

export type Book = {
    _id: string,
    TENSACH: string,
    THELOAI: Category,
    DONGIA: number,
    SOQUYEN: number,
    NAMXUATBAN: number,
    NHAXUATBAN: Publisher,
    TACGIA: string,
    MOTA: string,
    HINHANH: string,
}