import { Component, Inject, Prop, Watch } from 'vue-property-decorator'
import { BaseApp } from './BaseApp'
import { _isEqual, _isUndefined } from '~/utils/lodash'
import FormRepository from '~/repositories/FormRepository'
import RuleHelper from '~/utils/RuleHelper'
import { IOption } from '~/components/form/FormTypes'

@Component
export default class BaseInput extends BaseApp {

  @Inject('form_name') readonly form_name!: string

  // innerValue is the updatable value
  innerValue: any = null
  @Prop() readonly value!: any
  @Prop() readonly defaultValue!: any
  @Prop(String) readonly name!: string
  @Prop(Array) readonly rules!: any[]
  @Prop(Function) readonly transform?: (value: any, oldValue: any) => any

  @Prop(Array) readonly options!: IOption[]

  @Prop(String) readonly className!: string
  @Prop(String) readonly label!: string
  @Prop(String) readonly placeholder!: string
  @Prop(Boolean) readonly disabled!: boolean
  @Prop(String) readonly explain!: string

  created() {
    // Priority in this order
    // - defaultValue
    // - value
    // - null
    if (!_isUndefined(this.defaultValue)) {
      this.innerValue = this.defaultValue
    } else if (!_isUndefined(this.value)){
      this.innerValue = this.value
    } else {
      this.innerValue = null
    }
  }

  onInput(value: any) {
    this.$emit('change', value)
    this.innerValue = this.transform
      ? this.transform(value, this.innerValue)
      : value || null
  }

  get isRequired(): boolean {
    return !!this.$array
      .toArray(this.rules)
      .find((r) => r === RuleHelper.required)
  }

  @Watch('innerValue', { deep: true })
  onChange(value: any, oldValue: any) {
    if (!_isEqual(value, oldValue)) {
      const newRawValue = _isUndefined(value) ? null : value
      this.formRepo.updateAttr(this.form_name, this.name, newRawValue)
      this.$emit('input', newRawValue)
    }
  }

  @Watch('value', { deep: true })
  onValueChange(value: any, oldValue: any) {
    if (!_isEqual(value, oldValue)) {
      this.innerValue = value
    }
  }

  @Watch('defaultValue', { deep: true })
  onDefaultValueChange(value: any, oldValue: any) {
    if (!_isEqual(value, oldValue)) {
      this.innerValue = this.defaultValue
    }
  }

  get formRepo(): FormRepository {
    return new FormRepository(this)
  }
}

export interface EventInput {
  target: HTMLInputElement
}