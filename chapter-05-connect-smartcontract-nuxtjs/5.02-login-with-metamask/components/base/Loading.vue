<template>
  <div v-if="loading" class="loading-page">
    <p>{{loadingText || 'Loading...'}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { Base } from '~/core/Base';

@Component
export default class LoadingPage extends Base {
  @Prop(Boolean) readonly loading!: boolean
  @Prop(String) readonly loadingText!: string
}
</script>

<style lang="scss" scoped>
  .loading-page {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding-top: 200px;
    font-size: 30px;
    font-family: sans-serif;
  }
</style>