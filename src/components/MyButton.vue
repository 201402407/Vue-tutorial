<template>
  <button type="button" @click="onClick">{{ title }}</button>
</template>

<script lang="ts">
import { Component, Prop, Emit } from "vue-property-decorator";
import PageVue from "@/components/PageVue.vue";

export interface MyButtonInterface {
  isActive: boolean;

  color: string;
}
@Component
export default class MyButton extends PageVue {
  @Prop({ required: true }) readonly title!: string; // Prop은 부모 컴퍼넌트 -> 자식 컴포넌트에 값 전달하는 역할
  @Prop() private buttonProps!: MyButtonInterface;

  @Emit("myButtonClick")
  onClick(e: Event) {
    return e;
  }
}
</script>
