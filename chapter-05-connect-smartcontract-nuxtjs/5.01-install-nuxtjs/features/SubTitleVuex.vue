<template>
  <div>
    <h2>{{vuexLoader.callItem.name}}</h2>
  </div>
</template>

<script lang="ts">
import { BaseApp } from '~/core/BaseApp'
import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class SubTitleVuex extends BaseApp {
}
</script>

<style scoped>
  h1, h2, h3 {
    text-align: center;
    color: lightgray;
    font-size: 1.2em;
  }
</style>