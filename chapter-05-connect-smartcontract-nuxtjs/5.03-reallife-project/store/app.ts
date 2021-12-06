import Vue from "vue";
import { IAppState } from "~/types/stores";

const prefix = 'app'

export const state = () => ({
  state: {}
})

export const getters = {
  getState: (state: any) => (key: string) => {
    return {...state.state[key] || {}}
  }
}

export const mutations = {
  // set of mutations to update app.[key]
  updateState: (state: any, data: { data: IUpdateStatePayload, key: string }) => {
    Vue.set(state, data.key, {
      ...state[data.key],
      ...data.data
    })
  },
  replaceState: (state: any, data: { data: IReplaceStatePayload | any, key: string, isRoot: boolean }) => {
    Vue.set(state, data.key, data.data)
  },

  // set of mutations to update app.state.[key]
  updateAppState: (state: any, data: { data: IUpdateStatePayload, key: string }) => {
    Vue.set(state.state, data.key, {
      ...state.state[data.key],
      ...data.data
    })
  },
  replaceAppState: (state: IAppState, data: { data: IReplaceStatePayload | any, key: string }) => {
    Vue.set(state.state, data.key, data.data)
  },
  destroyAppState: (state: IAppState, data: { key: string }) => {
    Vue.delete(state.state, `${data.key}_add`)
    Vue.delete(state.state, `${data.key}_update`)
    Vue.delete(state.state, `${data.key}_delete`)
    Vue.delete(state.state, `${data.key}_find`)
    Vue.delete(state.state, `${data.key}_fetch`)
    Vue.delete(state.state, `${data.key}_call`)
    Vue.delete(state.state, `${data.key}_send`)
  }
}

export interface IUpdateStatePayload {
  isError?: boolean
  isSuccess?: boolean
  isLoading?: boolean
  isLoaded?: boolean
  errorData?: any
  options?: any
  data?: any
  items?: any[]
}

export interface IReplaceStatePayload {
  isError?: boolean
  isSuccess?: boolean
  isLoading?: boolean
  isLoaded?: boolean
  errorData?: any
  options?: any
  data?: any
  items?: any[]
}

declare interface IDispatch {
  readonly type: string;
  payload?: any;
}

interface ISaveState extends IDispatch {
  key: string
}

export class UpdateAppState implements ISaveState {
  type = `${prefix}/updateAppState`
  constructor(public key: string, public data: IUpdateStatePayload) {
  }
}

export class ReplaceAppState implements ISaveState {
  type = `${prefix}/replaceAppState`
  constructor(public key: string, public data: IReplaceStatePayload, public isRoot: boolean = false) {}
}

export class DestroyAppState implements ISaveState {
  type = `${prefix}/destroyAppState`
  constructor(public key: string) {}
}

export const AppActions = { ReplaceAppState, DestroyAppState }