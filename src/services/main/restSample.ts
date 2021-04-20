// HTTPService,GET, QUERY 등 알아보기

import { HttpService } from "@/utils/http"

// STORE 내부 객체 및 변수 선언(interface로)
export interface ItemList {
    id: number
    item: string
    status: string
}

// STORE 내부 객체 및 변수 선언(interface로)
export interface ResVo {
    word: string
    sha256: string
    md5: string
}

// 서비스 로직 단 구현
export default class RestSample extends HttpService {
    async login() {
        return await this.getInstance().get("api/login")
    }
}
