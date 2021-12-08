
import Web3 from 'web3'
import { UpdateAppState, ReplaceAppState } from "~/store/app"
import { _get, _isUndefined } from '~/utils/lodash'
import { commonListState, commonObjectState } from '~/types/states'
import { BaseLoader, ILoaderOption } from './BaseLoader'

export class ObjectLoader<T = any> extends BaseLoader<T> {
  
  constructor(
    protected _vm: any,
    public options: (data?: any) => ILoaderOption,
  ) {
    super(_vm, options)

    const stateKey = this.callStateKey
    const state = this.getStateByKey(stateKey)
    if (!state) {
      this.commit(new ReplaceAppState(stateKey, commonObjectState()))
    }
  }

  public call = async (myObject: any) => {
    const stateKey = this.callStateKey
    this.toSuccessStatus(stateKey, myObject)
    this.toCompleteStatus(stateKey)
  }
}