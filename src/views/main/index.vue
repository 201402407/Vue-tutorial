<template>
    <div>메인페이지</div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class Test extends Vue {
  created() { // init 후 DOM 추가 전 호출. DOM에 컴포넌트가 MOUNT 되기 전. $el 사용 X
    console.log("Created!");
  }

  mounted() { // 컴포넌트가 DOM에 추가된 후 호출.
    console.log("Mounted!");
    this.$nextTick(() => {
      // 모든 화면이 렌더링 된 후 호출
      console.log("모든 화면 렌더링 완료!");
    })
  }
}

</script>