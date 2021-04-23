import store from "@/stores/index"
import {
  getModule,
  Module,
  VuexModule,
  Mutation,
  Action,
} from "vuex-module-decorators"
import RestSample, { ItemList, ResVo } from "@/services/main/restSample"
import Vue from "vue"

export interface LoginPVO {
  id: string
  pwd: string
}

@Module({ dynamic: true, name: "mainStore", namespaced: true, store })
export default class MainStore extends VuexModule {
  // 클래스 내부 변수 선언
  itemList!: ItemList
  resVo!: ResVo

  // itemList  = [
  //     { id: 1, item: '씻기', status: 'clear' },
  //     { id: 2, item: '준비하기', status: 'clear' },
  //     { id: 3, item: '학교가기', status: 'clear' },
  //     { id: 4, item: '게임하기', status: 'yet' },
  // ]

  // 서비스 또는 작업 수행(서버 연동)
  @Action
  async chkLogin(pvo: LoginPVO) {
    return await new RestSample().login(pvo) // 여긴 서버 API 통신 함수 호출
  }

  // Data Store에 저장하는 Annotation
  @Mutation
  setMainInfos() {
    Vue.set(this, "itemList", [])
    Vue.set(this, "resVo", {})
  }

  get getResVo() {
    return this.resVo
  }
}

export const MainModule = getModule(MainStore)
