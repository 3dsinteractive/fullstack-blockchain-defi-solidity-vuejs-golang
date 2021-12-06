<template>
<div>
  <InputText
    v-if="isTextField()"
    :value="value[option.props.name]"
    v-bind="option.props"
    v-on="{ ...option.props.on }"
  />
  <Select
    v-else-if="isSelect()"
    :value="value[option.props.name]"
    v-bind="option.props"
    v-on="{ ...option.props.on }"
  />
  <Textarea
   v-else-if="isTextarea()"
    :value="value[option.props.name]"
    v-bind="option.props"
    v-on="{ ...option.props.on }"
  />
</div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { Base } from '~/core/Base'
import { IFormOption, INPUT_TYPES } from '~/components/form/FormTypes'

@Component
export default class FieldCondition extends Base {
  @Prop(Object) readonly option!: IFormOption
  @Prop(Object) readonly value!: IFormOption

  isTextField(): boolean {
    return this.option.type === INPUT_TYPES.TEXT
  }
  isSelect(): boolean {
    return this.option.type === INPUT_TYPES.SELECT
  }
  isTextarea(): boolean {
    return this.option.type === INPUT_TYPES.TEXTAREA
  }
}
</script>