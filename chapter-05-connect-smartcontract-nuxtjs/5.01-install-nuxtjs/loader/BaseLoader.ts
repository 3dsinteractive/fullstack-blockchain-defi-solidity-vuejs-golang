import { v4 as uuidV4 } from 'uuid'
import { UpdateAppState } from "~/store/app"
import { IStatus } from "~/types/states"
import { IState } from "~/types/stores"
import { _get } from '~/utils/lodash'
import ObjectHelper from "~/utils/ObjectHelper"

export interface ILoaderOption {
  handle?: () => Promise<any>
  stateKey?: string
  mockCallItems?: any[]
  onCallSuccess?: (status: IStatus) => void
  onCallError?: (status: IStatus) => void
}

export class BaseLoader<T = any>  {
  private stateKey: string = null

  constructor(
    protected _vm: any,
    public options: (data?: any) => ILoaderOption,
  ){
    this.stateKey = this.options()?.stateKey ?? uuidV4()
  }

  get callStateKey(): string {
    return `${this.stateKey}_call`
  }

  get callItem(): T {
    return _get(this.getStateByKey(this.callStateKey), 'data', {})
  }

  get callItems(): T[] {
    return _get(this.getStateByKey(this.callStateKey), 'items', [])
  }

  get callStatus() {
    return ObjectHelper.toStatus(
      this.getStateByKey(this.callStateKey),
    )
  }

  protected getStateByKey(key: string): any {
    return this.getters['app/getState'](key)
  }

  protected toLoadingStatus(key: string) {
    this.commit(
      new UpdateAppState(key, {
        isLoading: true,
        isLoaded: false,
        isError: false,
        isSuccess: false,
        errorData: null,
      }),
    )
  }

  protected toSuccessStatus(key: string, data: any, options: any = {}) {
    this.commit(
      new UpdateAppState(key, {
        isSuccess: true,
        data: data,
        options: options,
      }),
    )
  }

  protected toSuccessItemsStatus(key: string, items: any[], options: any = {}) {
    this.commit(
      new UpdateAppState(key, {
        isSuccess: true,
        items: items,
        options: options,
      }),
    )
  }

  protected toErrorStatus(key: string, error: any) {
    this.commit(
      new UpdateAppState(key, {
        isError: true,
        errorData: error,
      }),
    )
  }

  protected toCompleteStatus(key: string) {
    this.commit(
      new UpdateAppState(key, {
        isLoading: false,
        isLoaded: true,
      }),
    )
  }

  protected get store() {
    return (this._vm as any).store || this._vm.$store
  }

  protected get state(): IState {
    return this.store.state
  }

  protected get dispatch(): any {
    return this.store.dispatch
  }

  protected get getters(): any {
    return this.store.getters
  }

  protected get commit(): any {
    return this.store.commit
  }
}