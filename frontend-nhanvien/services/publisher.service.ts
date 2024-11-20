import createHttp from "~/http/createHttp";
import type { Publisher } from "~/models/publisher";

class PublisherService {
    constructor(private readonly http=createHttp("publisher")){

    }
    async getAllPublisher(): Promise<Array<Publisher>>{
        return (await this.http.get("/"))
    }
    async createPublisher(MANXB: string, TENNXB: string, DIACHI: string){
        
        return (await this.http.post("/", {MANXB, TENNXB, DIACHI}))
    }
    async updatePublisher(category: Publisher){
        return (await this.http.put("/", category))
    }
    async deletePublisher(id: string){
        console.log(id)
        return (await this.http.delete(`/${id}`))
    }
}

export default new PublisherService()