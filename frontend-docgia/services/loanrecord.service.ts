import createHttp from "~/http/createHttp";
import type { Category } from "~/models/category";
import type { LoanRecord } from "~/models/loanrecord";
export type TokenRes2 = Array<Category>
class LoanRecordService {
    constructor(private readonly http=createHttp("loanrecord")){

    }
    // async getAllCategory(): Promise<Array<Category>>{
    //     return (await this.http.get("/"))
    // }

    async loanBook(DOCGIA: string, SACH: string, NGAYMUON: Date, NGAYTRA: Date){
        return (await this.http.post("/", {DOCGIA, SACH, NGAYMUON, NGAYTRA}))
    }

    async getLoanRecord(id: string): Promise<Array<LoanRecord>>{
        return (await this.http.get(`/${id}`))
    }
    // async updateCategory(category: Category){
    //     return (await this.http.put("/", category))
    // }
    // async deleteCategory(id: string){
    //     console.log(id)
    //     return (await this.http.delete(`/${id}`))
    // }
}

export default new LoanRecordService()