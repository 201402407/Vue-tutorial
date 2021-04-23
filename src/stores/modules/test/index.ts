import store from "@/stores/index";
import {
  getModule,
  Module,
  VuexModule,
  Mutation,
  Action,
} from "vuex-module-decorators";
import Vue from "vue";

@Module({ dynamic: true, name: "testStore", namespaced: true, store })
class TestStore extends VuexModule {
  // 클래스 내부 변수 선언
  num!: number;
  name!: string;

  get getNum() {
    return this.num;
  }

  get getName() {
    return this.name;
  }

  @Mutation
  changeNum(inputNum: number) {
    console.log("asf" + inputNum + " ,." + this.num);
    Vue.set(this, "num", inputNum); // this = 값 사용하면 처음에만 적용이 됨. 그래서, Vue.set 사용 필수
  }

  @Mutation
  changeName(inputName: string) {
    Vue.set(this, "name", inputName);
  }

  @Action({ commit: "changeNum" })
  setMyNum(inputNum: number) {
    console.log("숫자 바꾸겠습니다");
    return (this.num = inputNum);
  }

  @Action({ commit: "changeName" })
  setMyName(inputName: string) {
    console.log("이름 바꾸겠습니다");
    return (this.name = inputName);
  }

  @Mutation
  increment(inputNum: number) {
    this.num += inputNum;
    console.log("[TestStore] increment " + this.num);
  }

  @Mutation
  decrement(inputNum: number) {
    this.num -= inputNum;
    console.log("[TestStore] decrement " + this.num);
  }

  @Action({ commit: "increment" })
  incr(inputNum: number) {
    console.log("[TestStore] incr");
    return inputNum;
  }

  @Action({ commit: "decrement" })
  decr(inputNum: number) {
    console.log("[TestStore] decr");
    return inputNum;
  }
}

export const TestModule = getModule(TestStore);
