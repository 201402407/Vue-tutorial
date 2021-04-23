import axios from "axios";

//instance 생성 후 => 사용자 정의 인스턴스 기본 설정
const instance = axios.create({
  baseURL: "https://maivve.tk:8443",
});

//HTTP GET
export const submitWoImg = {
  list(bodyFormData) {
    return instance.get("/api/getNumber", bodyFormData);
  },
};

// HTTP POST
// 데이터를 받아온 후 bodyFormData에 요청데이터 담기
export const submitWImg = {
  list(id, pwd) {
    console.log(id, pwd);
    var bodyFormData = new FormData();
    bodyFormData.set("id", id);
    bodyFormData.set("pwd", pwd);
    return instance.post("/api/login", bodyFormData);
  },
};

// HTTP POST
// 요청데이터가 담긴 bodyFormData
export const listsPage = {
  list(bodyFormData) {
    return instance.post("/api/join", bodyFormData);
  },
};
