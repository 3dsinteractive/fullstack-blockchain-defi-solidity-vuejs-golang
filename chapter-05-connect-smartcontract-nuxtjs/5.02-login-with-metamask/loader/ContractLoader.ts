import { _get } from '~/utils/lodash'
import { commonListState } from '~/types/states'
import { ReplaceAppState } from '~/store/app'
import { WaitGroup } from '~/utils/WaitGroup'
import { BaseLoader, ILoaderOption } from './BaseLoader'

export class ContractLoader<T = any> extends BaseLoader<T>{
  
  constructor(
    protected _vm: any,
    public options: (data?: any) => ILoaderOption,
  ) {
    super(_vm, options)

    const stateKey = this.callStateKey
    const state = this.getStateByKey(stateKey)
    if (!state) {
      this.commit(new ReplaceAppState(stateKey, commonListState()))
    }
  }

  public call = async (wg: WaitGroup = null) => {

    const stateKey = this.callStateKey
    const opts = this.options()

    try {
      this.toLoadingStatus(stateKey)
      const response = await opts.handle()
      if (response) {
        // only keep response in vuex if response is defined
        if (Array.isArray(response)) {
          this.toSuccessItemsStatus(stateKey, response)
        } else {
          this.toSuccessItemsStatus(stateKey, [response])
        }
      }
      if (opts.onCallSuccess) {
        opts.onCallSuccess!(this.callStatus)
      }
      
    } catch (e: any) {
      this.toErrorStatus(stateKey, e)
      if (opts.onCallError) {
        opts.onCallError!(this.callStatus)
      }
    } finally {
      this.toCompleteStatus(stateKey)
      if (wg) {
        wg.done()
      }
    }
  }
}