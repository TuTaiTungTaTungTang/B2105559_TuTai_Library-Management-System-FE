import createHttp from "~/http/createHttp";
import type { Member } from "~/models/member";

export type TokenRes={
    accessToken: string
}

class AuthService {
    constructor(private readonly http=createHttp("member")){

    }
    async login(MADOCGIA: string, MATKHAU: string, type: string): Promise<TokenRes>{
        return this.http.post(`/${type}`, {MADOCGIA, MATKHAU})
    }

    async reg(MADOCGIA: string, MATKHAU: string, HOLOT: string,
        TEN: string, NGAYSINH: Date, PHAI: string, DIACHI: string,
        SODIENTHOAI: string, type: string
    ): Promise<TokenRes>{
        return this.http.post(`/${type}`, {MADOCGIA, MATKHAU, HOLOT, TEN
            , NGAYSINH, PHAI, DIACHI, SODIENTHOAI
        })
    }

    async auth():Promise<Member>{
        return this.http.get("/")
    }
}

export default new AuthService()