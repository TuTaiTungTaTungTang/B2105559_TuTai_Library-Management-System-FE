import createHttp from "~/http/createHttp";
import type { Category } from "~/models/category";
export type TokenRes2 = Array<Category>
class CategoryService {
    constructor(private readonly http=createHttp("category")){

    }
    async getAllCategory(): Promise<Array<Category>>{
        return (await this.http.get("/"))
    }

    async createCategory(MATHELOAI: string, TENTHELOAI: string){
        return (await this.http.post("/", {MATHELOAI, TENTHELOAI}))
    }
    async updateCategory(category: Category){
        return (await this.http.put("/", category))
    }
    async deleteCategory(id: string){
        console.log(id)
        return (await this.http.delete(`/${id}`))
    }
}

export default new CategoryService()