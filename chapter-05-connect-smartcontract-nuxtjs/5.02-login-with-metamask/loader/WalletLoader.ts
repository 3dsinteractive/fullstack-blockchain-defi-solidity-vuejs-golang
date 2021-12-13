
import Web3 from 'web3'
import { UpdateAppState, ReplaceAppState } from "~/store/app"
import { _get, _isUndefined } from '~/utils/lodash'
import { commonListState } from '~/types/states'
import { BaseLoader, ILoaderOption } from './BaseLoader'

export class WalletLoader<T = any> extends BaseLoader<T> {
  
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

  public call = async (opts: any = { reconnect: false }) => {

    if (!process.browser){
      return
    }

    const stateKey = this.callStateKey

    this.toLoadingStatus(stateKey)

    try {
      let web3 = this._vm.$web3 as Web3

      let accounts: any = null
      if (web3 && opts && opts.reconnect) {
        // When reconnect, we will refresh the accounts, if we already login
        accounts = await web3.eth.getAccounts()
        if (accounts.length > 0) {
          // eth_requestAccounts will popup metamask login
          accounts = await (window as any).ethereum.request({
            method: 'eth_requestAccounts',
          })
        }
      } else {
        // eth_requestAccounts will popup metamask login
        accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        })
      }

      const isConnected = await web3.eth.net.isListening()
      if (isConnected) {
        this.toSuccessItemsStatus(stateKey, accounts)
      }

      if (this.options().onCallSuccess) {
        this.options().onCallSuccess!(this.callStatus)
      }
    } catch (e: any) {
      this.toErrorStatus(stateKey, e)
      if (this.options().onCallError) {
        this.options().onCallError!(this.callStatus)
      }
    }

    this.toCompleteStatus(stateKey)
  }
}