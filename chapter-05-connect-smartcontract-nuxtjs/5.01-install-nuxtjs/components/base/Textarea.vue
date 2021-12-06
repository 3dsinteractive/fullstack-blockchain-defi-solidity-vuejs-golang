<template>
  <div class="form-item">
    <label v-if="label !== undefined">
      {{ label }}
      <span v-if="isRequired" class="red--text">&nbsp;*</span>
    </label>
    <v-textarea
      :rules="rules"
      :name="name"
      :value="value"
      :placeholder="placeholder ? placeholder : label"
      :rows="rowsAmount"
      color="primary"
      background-color="white"
      outlined
      dense
      :disabled="disabled"
      @input="onInput">
    </v-textarea>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import BaseInput from '~/core/BaseInput'

@Component
export default class Textarea extends BaseInput {
  @Prop({default: '4'}) readonly rowsAmount!: string
}
</script>