import { Base } from '~/core/Base'
import { IState } from '~/types/stores'

export class BaseRepository {
  protected _vm: any
  constructor(_vm: Base | any) {
    this._vm = _vm
  }

  get state(): IState {
    return this.store.state
  }

  get getters(): any {
    return this.store.getters
  }

  get commit(): any {
    return this.store.commit
  }

  get dispatch(): any {
    return this.store.dispatch
  }
  
  get store() {
    return (this._vm as any)?.store || this._vm?.$store
  }
}