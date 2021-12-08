<template>
  <div class="wrapper">
    <h2>{{subTitle}}</h2>
    <h3>SubTitle Vuex name = {{mockObjectLoader.callItem.name}}, value = {{mockObjectLoader.callItem.value}}</h3>
  </div>
</template>

<script lang="ts">
import { BaseApp } from '~/core/BaseApp'
import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Home extends BaseApp {
  @Prop(String) readonly subTitle!: string
}
</script>

<style scoped>
  h2, h3 {
    text-align: center;
  }
</style>