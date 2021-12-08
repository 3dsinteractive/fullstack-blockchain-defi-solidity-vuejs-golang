<template>
  <div class="wrapper">
    <h1>{{myTitle}}</h1>
    <SubTitle :subTitle="subTitle" />
    <h3>Home Vuex name = {{mockObjectLoader.callItem.name}}, value = {{mockObjectLoader.callItem.value}}</h3>
    <div class="buttons">
      <a class="button-item" @click="onClickMe">Click me</a>
      <a class="button-item" @click="onGetHelloBaseClass">Get Hello from base class</a>
      <a class="button-item" @click="onSetSubTitle">Set SubTitle</a>
      <a class="button-item" @click="onSetVuex">Set Vuex</a>
      <a class="button-item" @click="valueToWatch = 'the new value to watch'">Update watch value</a>
    </div>
    <div class="buttons">
      <NuxtLink class="button-item" to="page2">Go to page 2</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import { BaseApp } from '~/core/BaseApp'
import { Component, Watch } from 'vue-property-decorator'
import SubTitle from './SubTitle.vue'

@Component({
  components: { SubTitle },
})
export default class Home extends BaseApp {

  // 1. variables
  private theTitle: string = 'Hello world from initializer'
  private subTitle: string = ''
  private valueToWatch: string = 'old value to watch'

  // 2. functions
  onClickMe() {
    this.theTitle = 'Hello world from onClickMe click'
  }

  // 3. getter / setters
  get myTitle(): string {
    return this.theTitle
  }

  set myTitle(value: string) {
    this.theTitle = value
  }

  // 4. event lifecycle created
  created() {
    this.theTitle = 'Hello world from created event'
  }

  // 5. event lifecycle mounted
  mounted() {
    this.theTitle = 'Hello world from mounted event'
  }

  // 6. getHello is protected modifier
  onGetHelloBaseClass() {
    this.myTitle = this.getHelloProtected()
    // this.myTitle = this.getHelloPublic()
    // this.myTitle = this.getHelloPrivate() // THIS CANNOT ACCESS
  }

  // 7. Send subTitle via prop
  onSetSubTitle() {
    this.subTitle = 'This is sub-title'
  }

  // 8. Loader is the way we use to set value to Vuex
  onSetVuex() {
    this.mockObjectLoader.call({
      name: 'name from vuex',
      value: 'value from vuex',
    })
  }

  // 9. Watch change of subTitle
  @Watch('valueToWatch')
  onSubTitleChanged(newValue: any, oldValue: any) {
    console.log(`valueToWatch changed from ${oldValue} to ${newValue}`)
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 30px;
}
h1, h3 {
  text-align: center;
}
.buttons {
  display: flex;
  justify-content: center;
  flex-direction: column;
  
  .button-item {
    display: block;
    background-color: gray;
    color: white;
    text-align: center;
    width: 200px;
    align-self: center;
    margin-top: 10px;
  }

  .button-item:hover {
    background-color: lightgray;
    color: gray;
  }
}
</style>