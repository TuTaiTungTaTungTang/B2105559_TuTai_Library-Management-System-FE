import type { Book } from "./book"
import type { Member } from "./member"

export type LoanRecord = {
    _id: string,
    DOCGIA: Member,
    SACH: Book,
    NGAYMUON: Date,
    NGAYTRA: Date,
    TRANGTHAI: number,
}