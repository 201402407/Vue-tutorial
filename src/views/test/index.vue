<template>
    <div id="test">
        <p>{{ this.count }}</p> <br> 
        <button @click="changeCount(2)">입력한 값을 카운트 값으로 변경</button> <br>
        <p>Getter Result : {{ getCount }}</p><br>
        <button @click="incrementCnt">카운트증가</button> <br>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class Test extends Vue {
    private count = 1
    
    @Emit('click')  // Emit은 자식 컴포넌트에서 만든 이벤트를 부모 컴퍼넌트에서 받아 활용할 수 있다.
    changeCount(num: number) {
        console.log("onClick : " + num);
        this.count = 2;
    }

    get getCount() {
        console.log("count : " + this.count);
        return this.count * 2;
    }

    set setCount(num: number) {
        this.count = num;
    }

    // onClick 이벤트 설정
    incrementCnt() {
        return this.count++;
    }
}

</script>