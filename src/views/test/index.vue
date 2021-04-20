<template>
  <div id="test">
    <p>{{ this.count }}</p>
    <br />
    <button @click="changeCount(2)">입력한 값을 카운트 값으로 변경</button>
    <br />
    <p>Getter Result : {{ getCount }}</p>
    <br />
    <button @click="incrementCnt">카운트증가</button> <br />
    <input
      :value="inputNum"
      @input="ChangeInputNum"
      type="text"
      placeholder="숫자입력테스트"
      @keyup.enter="go()"
    /><br />
    <!-- bind: 단방향 통신 / model: 양방향 통신 -->
    <h2>{{ inputNum }}</h2>
    <input v-model="watchWord" type="text" placeholder="watch test" />
    <br />
    <br />
    <button @click="storeIncrement">Store increment</button><br />
    <br />
    <input
      :value="inputName"
      @input="ChangeInputName"
      type="text"
      placeholder="스토어 값 저장 테스트 - String"
      @keyup.enter="goStore()"
    /><br />
    <h2>{{ inputName }}</h2>
    <my-button title="Prop 전달 타이틀" @myButtonClick="emitClick"></my-button
    ><br />
    <input
      v-model="tempObj.name"
      placeholder="Object Watch 테스트 Name"
    /><br />
    <input v-model="tempObj.age" placeholder="Object Watch 테스트 Age" /><br />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from "vue-property-decorator"
import MyButton from "@/components/MyButton.vue"
import { TestModule } from "@/stores/modules/test/index"
// import TestChild from '@/views/test/child'

interface TempObj {
  name: string
  age?: number
}

@Component({
  components: {
    "my-button": MyButton,
  },
})
export default class Test extends Vue {
  // @Prop({ type: Object, required: true }) readonly propData!: string // Prop은 부모 컴퍼넌트 -> 자식 컴포넌트에 값 전달하는 역할
  private tempObj: TempObj = {
    name: "",
  }

  private count = 1
  private inputNum = 0
  private inputNN = 0
  private inputName = ""
  private watchWord = ""

  // Watch: 해당 값을 실시간으로 감시하고, 변경되면 호출
  // immediate: 컴포넌트 생성 시 즉시 동작 시작
  // deep: 객체의 내부 변수 값이 변경되면 호출하도록 설정(원래는 내부 변수 값이 바껴도 동작함)
  @Watch("watchWord", { immediate: true, deep: true })
  public consoleWatchWord(newVal: string, oldVal: string) {
    //console.log(`{oldVal} 에서 {newVal} 로 변경쓰`)
    console.log(oldVal + " 에서 " + newVal + "으로")
  }

  // Emit은 자식 컴포넌트 -> 부모 컴퍼넌트
  @Emit("click") // Emit은 자식 컴포넌트에서 만든 이벤트를 부모 컴퍼넌트에서 받아 활용할 수 있다.
  changeCount(num: number) {
    console.log("onClick : " + num)
    this.count = 2
  }

  get validTempObj() {
    return JSON.parse(JSON.stringify(this.tempObj))
  }
  @Watch("validTempObj", { immediate: true, deep: true })
  private changeTempObj(newObj: TempObj, oldObj: TempObj) {
    console.log("NEW : " + JSON.stringify(newObj))
    console.log("OLD : " + JSON.stringify(oldObj))
  }

  //my-button 과 연결됨
  emitClick(e: Event) {
    console.log(e.target)
    const target = e.target as HTMLInputElement
    console.log(target.innerText)
  }

  get getCount() {
    console.log("count : " + this.count)
    return this.count * 2
  }

  set setCount(num: number) {
    this.count = num
  }

  // onClick 이벤트 설정
  incrementCnt() {
    return this.count++
  }

  go() {
    TestModule.setMyNum(this.inputNum)
  }

  ChangeInputNum(e: Event) {
    const target = e.target as HTMLInputElement
    this.inputNum = Number(target.value)
    console.log(Number(target.value))
  }
  ChangeInputName(e: InputEvent) {
    const target = e.target as HTMLInputElement
    this.inputName = target.value
  }

  // Store
  storeIncrement() {
    TestModule.increment(this.count)
  }
  goStore() {
    TestModule.setMyName(this.inputName)
  }
}
</script>
