// Typescript 는 Javascript(구현만 존재) 와는 다르게 모듈 구현(implement) 와 타입 선언(declaration) 이 동시에 일어나기 때문에,
// JS 모듈 사용 시 컴파일러가 이해할 수 있게 별도의 모듈로 만들어 타입 선언해야함.
// 모듈의 타입 선언
declare module 'lodash' {
    // 타입(인터페이스) 선언
    interface ILodash {}
}
