import { Base } from "./Base";
import { AbiItem } from 'web3-utils'
import { WalletLoader } from '~/loader/WalletLoader'
import { ContractLoader } from '~/loader/ContractLoader'
import { 
  toWei, 
  toBasis, 
  toBytes32,
  toBN, 
  zeroAddr,
  getNetwork,
  getChainId } from '~/utils/util'
import { 
    getAddressOfToken, 
    TokenNames
} from '~/consts/config'
import BN from 'bn.js'

import TokenAContract from '~/build/contracts/TokenA.json'
import { TokenA } from '~/types/web3-v1-contracts/TokenA'
import TokenBContract from '~/build/contracts/TokenB.json'
import { TokenB } from '~/types/web3-v1-contracts/TokenB'

export class BaseApp extends Base {
  isShowLogin: boolean = false
  isLoading: boolean = false

  balanceOfTokenA(): ContractLoader {
    return new ContractLoader(this, (_: any) => ({
      stateKey: 'tokena_balance',
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.TokenA)
        const contract = this.getTokenAContract(addr)

        try {
          const res = await contract.methods.balanceOf(this.walletAddress).call()
          return res
        } catch (err: any) {
          const errmsg = this.$web3Helper.errorMessage(err)
          throw new Error(errmsg)
        }
      }
    }))
  }

  mintTokenA(
    amount: BN,
    success: (IStatus) => void = null, 
    err: (IStatus) => void = null): ContractLoader {
    
    return new ContractLoader(this, (_: any) => ({
      stateKey: 'mint_tokena',
      onCallSuccess: success,
      onCallError: err,
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.TokenA)
        const contract = this.getTokenAContract(addr)

        try {
          const gasPrice = await this.$web3.eth.getGasPrice()
          const gas = await contract.methods.mint(amount).estimateGas()
          const params = {
            gas: gas,
            gasPrice: gasPrice
          }

          const res = await contract.methods.mint(amount).send(params)
          return res
        } catch (err: any) {
          const errmsg = this.$web3Helper.errorMessage(err)
          throw new Error(errmsg)
        }
      }
    }))
  }

  getTokenAContract(addr: string): TokenA {
    return new this.$web3.eth.Contract(TokenAContract.abi as AbiItem[], addr, {
      from: this.walletAddress
    }) as any as TokenA
  }

  mintTokenB(
    amount: BN,
    success: (IStatus) => void = null, 
    err: (IStatus) => void = null): ContractLoader {
    
    return new ContractLoader(this, (_: any) => ({
      stateKey: 'mint_tokenb',
      onCallSuccess: success,
      onCallError: err,
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.TokenB)
        const contract = this.getTokenBContract(addr)

        try {

          const gasPrice = await this.$web3.eth.getGasPrice()
          const gas = await contract.methods.mint(amount).estimateGas()
          const params = {
            gas: gas,
            gasPrice: gasPrice
          }

          const res = await contract.methods.mint(amount).send(params)
          return res
        } catch (err: any) {
          const errmsg = this.$web3Helper.errorMessage(err)
          throw new Error(errmsg)
        }
      }
    }))
  }

  balanceOfTokenB(): ContractLoader {
    return new ContractLoader(this, (_: any) => ({
      stateKey: 'tokenb_balance',
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.TokenB)
        const contract = this.getTokenBContract(addr)

        try {
          const res = await contract.methods.balanceOf(this.walletAddress).call()
          return res
        } catch (err: any) {
          const errmsg = this.$web3Helper.errorMessage(err)
          throw new Error(errmsg)
        }
      }
    }))
  }

  getTokenBContract(addr: string): TokenB {
    return new this.$web3.eth.Contract(TokenBContract.abi as AbiItem[], addr, {
      from: this.walletAddress
    }) as any as TokenB
  }

  async addChain(chainId: string) {
    const provider = this.$web3.currentProvider as any
    if (chainId == '0x61') {
      await provider.sendAsync({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x61',
          chainName: 'BSC Testnet',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
          },
          rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
          blockExplorerUrls: ['https://testnet.bscscan.com']
        }],
        id: Math.round(Math.random() * 100000),
      })
    }
  }

  async switchChain(chainId: string) {
    const provider = this.$web3.currentProvider as any
    await provider.sendAsync({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: chainId}],
      id: Math.round(Math.random() * 100000),
    })
  }

  loginMetamask() {
    this.walletLoader(async ()=>{
      await this.switchChain(getChainId())
    }).call()
  }

  get walletAddress() {
    const addrs = this.walletLoader().callItems
    if (addrs && addrs.length > 0) {
      return addrs[0]
    }
    return null
  }

  get isLogin(): boolean {
    const wallet = this.walletLoader()
    return wallet.callItems != null && wallet.callItems.length > 0
  }

  walletLoader(
    success: (IStatus) => void = null, 
    err: (IStatus) => void = null): WalletLoader {
      
    return new WalletLoader(this, (_: any) => ({
      handle: null,
      stateKey: 'my_wallet',
      onCallSuccess: success,
      onCallError: err,
    }))
  }

  showLoginDialog() {
    this.isShowLogin = true
  }

  hideLoginDialog() {
    this.isShowLogin = false
  }

}