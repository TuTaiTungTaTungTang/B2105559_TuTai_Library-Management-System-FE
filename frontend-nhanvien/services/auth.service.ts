import createHttp from "~/http/createHttp";
import type { Librarian } from "~/models/librarian";

export type TokenRes={
    accessToken: string
}

class AuthService {
    constructor(private readonly http=createHttp("librarian")){

    }
    async login(MSNV: string, MATKHAU: string): Promise<TokenRes>{
        return this.http.post("/", {MSNV, MATKHAU})
    }

    async auth():Promise<Librarian>{
        return this.http.get("/")
    }
}

export default new AuthService()