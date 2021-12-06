<template>
  <Play />
</template>

<script lang="ts">
import { BaseApp } from '~/core/BaseApp'
import Play from '~/features/Play.vue'
import { Component } from 'vue-property-decorator'

@Component({
  components: { Play },
})
export default class IndexPage extends BaseApp {
}
</script>