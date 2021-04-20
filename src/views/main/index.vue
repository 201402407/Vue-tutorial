<template>
  <div>
    <h1>메인페이지</h1>
    <br />
    <button @click="getStoreNum">스토어 값 확인하기</button><br /><br />
    {{ testNum }} <br />
    <button @click="getStoreName">스토어 이름 확인하기</button><br /><br />
    {{ testName }}
    <button @click="postLogin">Login API 통신</button><br /><br />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator"
import { TestModule } from "@/stores/modules/test/index"
import { MainModule } from "@/stores/modules/main/index"
import { LoginPVO } from "@/stores/modules/main/index"

@Component
export default class Main extends Vue {
  private testNum = 0
  private testName = ""

  private pvo: LoginPVO = {
    id: "test",
    pwd: "test",
  }

  created() {
    // init 후 DOM 추가 전 호출. DOM에 컴포넌트가 MOUNT 되기 전. $el 사용 X
    console.log("Created!")
  }

  mounted() {
    // 컴포넌트가 DOM에 추가된 후 호출.
    console.log("Mounted!")
    this.$nextTick(() => {
      // 모든 화면이 렌더링 된 후 호출
      console.log("모든 화면 렌더링 완료!")
    })
  }

  postLogin() {
    const rvo = MainModule.chkLogin(this.pvo)
    console.log(rvo)
  }

  getStoreNum() {
    //TestModule.getgetNum()
    this.testNum = TestModule.getNum
  }

  getStoreName() {
    this.testName = TestModule.getName
  }
}
</script>
