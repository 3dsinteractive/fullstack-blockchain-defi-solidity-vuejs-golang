<template>
  <div>
    <h2>{{subTitle}}</h2>
  </div>
</template>

<script lang="ts">
import { BaseApp } from '~/core/BaseApp'
import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class SubTitle extends BaseApp {
  @Prop(String) readonly subTitle!: string
}
</script>

<style scoped>
  h1, h2, h3 {
    text-align: center;
    color: lightgray;
    font-size: 1.2em;
  }
</style>