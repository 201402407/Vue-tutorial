<template>
    <div id="test">{{ count }} <br>
        <button @click="onClick('2')">카운트증가</button>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class Test extends Vue {
    private count = 1
    
    @Emit('click')
    onClick(num: number) {
        console.log("onClick");
        return this.count + num
    }
}

</script>