import createHttp from "~/http/createHttp";

export type UploadRes = {
    filename: string
}

class UploadService {
    constructor(private readonly http = createHttp("upload")) {

    }
    async uploadImage(file: File): Promise<UploadRes> {
        const formData = new FormData()
        formData.append("file", file)
        return this.http.post('', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    getFileUrl(filename: string): string {
        return "http://localhost:3000/statics/" + filename
    }
}

export default new UploadService()