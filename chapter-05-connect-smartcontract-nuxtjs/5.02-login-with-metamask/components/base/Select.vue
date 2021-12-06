<template>
  <div class="form-item">
    <label v-if="label !== undefined">
      {{ label }}
      <span v-if="isRequired" class="red--text">&nbsp;*</span>
    </label>
    <div v-if="explain !== undefined" class="explain">{{explain}}</div>
    <v-select
      :rules="rules"
      :placeholder="placeholder ? placeholder : label"
      :items="options"
      :value="innerValue"
      :class="className"
      item-text="label"
      item-value="value"
      outlined
      dense
      :disabled="disabled"
      @input="onInput"
      @change="$emit('onChange')"
    >
    </v-select>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import BaseInput from '~/core/BaseInput'

@Component
export default class Select extends BaseInput {
}
</script>