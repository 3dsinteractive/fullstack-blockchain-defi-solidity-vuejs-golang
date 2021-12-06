<template>
<div>
  <keep-alive>
    <v-row>
      <template v-for="(option, index) in options">
        <v-col
          v-if="!option.isHide"
          :key="index"
          :class="`py-0 ${option.className ? option.className : ''}`"
          :cols="option.col"
        >
          <div>
            <FieldCondition :option="option" :value="getValueFromOptions()" />
          </div>
        </v-col>
      </template>
    </v-row>
  </keep-alive>
</div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { Base } from '~/core/Base'
import { IFormOption } from '~/components/form/FormTypes'
import { _get, _isUndefined } from '~/utils/lodash'
import FieldCondition from '~/components/form/FieldCondition.vue'

@Component({
  components: { FieldCondition }
})
export default class Field extends Base {

  @Prop({ default: [], required: true, type: Array }) 
  readonly options!: IFormOption[]

  // value usually is formRepository
  @Prop({ type: Object, default: () => ({}) }) 
  readonly value!: any

  getValueFromOptions(): object {
    const data: any = {}
    this.options.forEach((item: any) => {
      if (item.props) {
        // 1. set value to _get(this.value, item.props.name) OR (item.props.defaultValue) or null
        // 2. return data[field_name] = value
        data[item.props.name] = 
          _isUndefined(_get(this.value, item.props.name, undefined))? 
            (_isUndefined(item.props.defaultValue)? null: item.props.defaultValue)
          : _get(this.value, item.props.name, null)
      }
    })
    return data
  }
}
</script>