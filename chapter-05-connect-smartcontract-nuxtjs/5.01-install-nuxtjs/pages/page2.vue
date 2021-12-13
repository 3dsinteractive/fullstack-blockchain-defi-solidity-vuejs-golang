<template>
<div class="wrapper">
    <div class="tutorials">
      <div class="tutorial-item">
        <h1>Page 2</h1>
        <div class="buttons">
          <NuxtLink class="button-item" to="/">Go to home</NuxtLink>
        </div>
      </div>
    </div>
</div>
</template>

<script lang="ts">
import { BaseApp } from '~/core/BaseApp'
import { Component } from 'vue-property-decorator'

@Component({
  // Use fetch when need to load state at server side into Vuex
  // async fetch (ctx: any) { },
  components: {}
})
export default class Page2Page extends BaseApp {
}
</script>


<style lang="scss" scoped>
.wrapper {

  h1, h2, h3 {
    text-align: center;
    font-size: 1.2em;
  }
  h2, h3 {
    color: gray;
  }

  padding: 30px;
  display: flex;
  flex-direction: column;
  min-width: 1000px;
}

.tutorials {
  display:flex;
  justify-content: center;
  flex-basis: 100%;
  flex-direction: column;

  .tutorial-item {
    align-self: center;
    width: 800px;
    padding: 10px;
    border: 1px solid lightgray;
  }
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
    width: 250px;
    align-self: center;
    margin-top: 10px;
    padding: 5px;
  }

  .button-item:hover {
    background-color: lightgray;
    color: gray;
  }
}
</style>