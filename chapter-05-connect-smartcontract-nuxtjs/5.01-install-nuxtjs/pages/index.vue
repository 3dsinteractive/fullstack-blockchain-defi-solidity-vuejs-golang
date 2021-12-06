<template>
  <Home />
</template>

<script lang="ts">
import { BaseApp } from '~/core/BaseApp'
import Home from '~/features/Home.vue'
import { Component } from 'vue-property-decorator'

@Component({
  components: { Home },
})
export default class IndexPage extends BaseApp {
}
</script>