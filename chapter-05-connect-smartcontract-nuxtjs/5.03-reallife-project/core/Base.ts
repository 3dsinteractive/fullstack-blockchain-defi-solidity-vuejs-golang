import Vue from 'vue'
import Web3 from 'web3'
import { ArrayHelper } from '~/utils/ArrayHelper'
import { Web3Helper } from '~/utils/Web3Helper'

export class Base extends Vue {

  protected _web3!: Web3
  get $web3(): Web3 {
    if (this._web3) {
      return this._web3
    }
    this._web3 = this.createWeb3()
    return this._web3
  }
  
  get $web3Helper() {
    return Web3Helper
  }

  get $array() {
    return ArrayHelper
  }

  createWeb3(): Web3 {
    if (!process.browser){
      return
    }
    
    if ((window as any).ethereum) {
      try {
        return new Web3((window as any).ethereum)
      } catch (err) {
        throw err
      }
    }
    return null
  }
}