<template>
<v-btn
  :type="type"
  :block="fullWidth"
  height="40"
  :width="inputWidth"
  color="primary"
  class="rounded-lg"
  :class="iconOnly ? 'px-0' : ''"
  :disabled="disabled"
  @click="$emit('click')"
  depressed
  :outlined="isOutlined">
  <v-icon v-if="isLoading" :class="`${iconOnly ? '' : 'mr-2'} spinner`" small>mdi-loading</v-icon>
  <v-icon v-else-if="icon && !isLoading" :class="iconOnly ? '' : 'mr-2'" small>{{ icon }}</v-icon>
  <slot></slot>
</v-btn>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { Base } from '~/core/Base'

@Component
export default class ButtonPrimary extends Base {
  @Prop(String) readonly icon!: string
  @Prop(Boolean) readonly fullWidth!: boolean
  @Prop(Boolean) readonly iconOnly!: boolean
  @Prop(Boolean) readonly disabled!: boolean
  @Prop(Boolean) readonly isLoading!: boolean
  @Prop({type: String, default: ''}) readonly inputWidth!: string
  @Prop({type: Boolean, default: false}) readonly isOutlined!: boolean
  @Prop({type: String, default: 'submit'}) readonly type!: string
}
</script>