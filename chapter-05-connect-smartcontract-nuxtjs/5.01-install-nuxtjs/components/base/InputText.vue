<template>
  <div class="form-item">
    <label v-if="label !== undefined">
      {{ label }}
      <span v-if="isRequired" class="red--text">&nbsp;*</span>
    </label>
    <v-text-field
      :rules="rules"
      :name="name"
      :value="value"
      :placeholder="placeholder ? placeholder : label"
      color="primary"
      background-color="white"
      outlined
      dense
      :disabled="disabled"
      @input="onInput"
    ></v-text-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import BaseInput from '~/core/BaseInput'

@Component
export default class InputText extends BaseInput {
}
</script>