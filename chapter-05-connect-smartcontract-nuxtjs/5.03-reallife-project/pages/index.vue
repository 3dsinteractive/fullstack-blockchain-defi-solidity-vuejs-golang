<template>
  <Swap />
</template>

<script lang="ts">
import { BaseApp } from '~/core/BaseApp'
import Swap from '~/features/Swap.vue'
import { Component } from 'vue-property-decorator'

@Component({
  components: { Swap },
})
export default class IndexPage extends BaseApp {
}
</script>