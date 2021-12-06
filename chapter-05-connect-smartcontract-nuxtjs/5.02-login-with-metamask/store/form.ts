import Vue from 'vue'
import { _clone, _get, _set } from '~/utils/lodash'
import { 
  IMutation,
  IFormState } from '~/types/stores'

const prefix = 'form'

export const state = (): object => ({
  data: {}
})

export const getters = {
  getByName:
    (state: any) =>
    (formName: string): any => {
      return { ...(state.data[formName] || {}) }
    },
  getFormValue:
    (state: any) =>
    (formName: string, attrName: string): any => {
      return _get(state.data, `[${formName}][${attrName}]`, null)
    }
}

export const mutations = {
  updateValue: (state: IFormState, { formName, attrName, value }: UpdateValue) => {
    if (attrName) {
      Vue.set(state.data, formName, _set(_clone(state.data[formName]), attrName, value))
    }
  },
  initForm: (state: IFormState, { formName, value }: InitForm) => {
    Vue.set(state.data, formName, value)
  },
  removeForm: (state: IFormState, { formName }: RemoveForm) => {
    Vue.delete(state.data, formName)
  }
}

class UpdateValue implements IMutation {
  type = `${prefix}/updateValue`
  constructor(
    public formName: string,
    public attrName: string,
    public value: any
  ) {}
}

class InitForm implements IMutation {
  type = `${prefix}/initForm`
  constructor(public formName: string, public value: any) {}
}

class RemoveForm implements IMutation {
  type = `${prefix}/removeForm`
  constructor(public formName: string) {}
}

export const FormMutations = { UpdateValue, RemoveForm, InitForm }