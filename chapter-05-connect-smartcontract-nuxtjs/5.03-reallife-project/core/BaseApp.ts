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
import ThePoolContract from '~/build/contracts/ThePool.json'
import { ThePool } from '~/types/web3-v1-contracts/ThePool'

export class BaseApp extends Base {
  isShowLogin: boolean = false
  isLoading: boolean = false

  async addToken(token: string) {
    const addr = getAddressOfToken(token)
    const provider = this.$web3.currentProvider as any
    await provider.sendAsync({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', 
        options: {
          address: addr, 
          symbol: token, 
          decimals: 18,
        }
      },
      id: Math.round(Math.random() * 100000),
    })
  }

  balanceOfThePoolToken(): ContractLoader {
    return new ContractLoader(this, (_: any) => ({
      stateKey: 'thepool_balance',
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.ThePool)
        const contract = this.getThePoolContract(addr)

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

  addLiquidity(
    amountA: string, 
    amountB: string,
    success: (IStatus) => void = null, 
    err: (IStatus) => void = null): ContractLoader {

    return new ContractLoader(this, (_: any) => ({
      stateKey: `add_liquidity`,
      onCallSuccess: success,
      onCallError: err,
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.ThePool)
        const thePool = this.getThePoolContract(addr)

        try {
          const amountAIn = toWei(`${amountA}`)
          const amountBIn = toWei(`${amountB}`)

          const gasPrice = await this.$web3.eth.getGasPrice()
          const gas = await thePool.methods.addLiquidity(amountAIn, amountBIn).estimateGas()
          const params = {
            gas: gas,
            gasPrice: gasPrice
          }

          const res = await thePool.methods.addLiquidity(amountAIn, amountBIn).send(params)
          return res
        } catch (err: any) {
          const errmsg = this.$web3Helper.errorMessage(err)
          throw new Error(errmsg)
        }
      }
    }))
  }

  swapAForB(
    amountA: string, 
    amountB: string,
    success: (IStatus) => void = null, 
    err: (IStatus) => void = null): ContractLoader {

    return new ContractLoader(this, (_: any) => ({
      stateKey: `swap_a_for_b`,
      onCallSuccess: success,
      onCallError: err,
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.ThePool)
        const thePool = this.getThePoolContract(addr)

        try {
          const amountAIn = toWei(`${amountA}`)
          const amountBOut = toWei(`${amountB}`)

          const gasPrice = await this.$web3.eth.getGasPrice()
          const gas = await thePool.methods.swapAForB(amountAIn, amountBOut).estimateGas()
          const params = {
            gas: gas,
            gasPrice: gasPrice
          }

          const res = await thePool.methods.swapAForB(amountAIn, amountBOut).send(params)
          return res
        } catch (err: any) {
          const errmsg = this.$web3Helper.errorMessage(err)
          throw new Error(errmsg)
        }
      }
    }))
  }

  amountBByA(amountA: string): ContractLoader {
    return new ContractLoader(this, (_: any) => ({
      stateKey: `amount_b_by_a`,
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.ThePool)
        const thePool = this.getThePoolContract(addr)

        try {
          const amountAIn = toWei(`${amountA}`)
          const res = await thePool.methods.getAmountBByA(amountAIn).call()
          return res
        } catch (err: any) {
          const errmsg = this.$web3Helper.errorMessage(err)
          throw new Error(errmsg)
        }
      }
    }))
  }

  allowanceOfTokenA(): ContractLoader {
    return new ContractLoader(this, (_: any) => ({
      stateKey: `tokena_allowance`,
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.TokenA)
        const tokenA = this.getTokenAContract(addr)
        const thePoolAddr = getAddressOfToken(TokenNames.ThePool)

        try {
          const res = await tokenA.methods.allowance(this.walletAddress, thePoolAddr).call()
          return res
        } catch (err: any) {
          const errmsg = this.$web3Helper.errorMessage(err)
          throw new Error(errmsg)
        }
      }
    }))
  }

  approveTokenA(
    success: (IStatus) => void = null, 
    err: (IStatus) => void = null): ContractLoader {

    return new ContractLoader(this, (_: any) => ({
      stateKey: `tokena_approve`,
      onCallSuccess: success,
      onCallError: err,
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.TokenA)
        const tokenA = this.getTokenAContract(addr)
        const thePoolAddr = getAddressOfToken(TokenNames.ThePool)

        try {
          const value = toWei(`${Number.MAX_SAFE_INTEGER}`)

          const gasPrice = await this.$web3.eth.getGasPrice()
          const gas = await tokenA.methods.approve(thePoolAddr, value).estimateGas()
          const params = {
            gas: gas,
            gasPrice: gasPrice
          }

          const res = await tokenA.methods.approve(thePoolAddr, value).send(params)
          return res
        } catch (err: any) {
          const errmsg = this.$web3Helper.errorMessage(err)
          throw new Error(errmsg)
        }
      }
    }))
  }

  approveTokenB(
    success: (IStatus) => void = null, 
    err: (IStatus) => void = null): ContractLoader {

    return new ContractLoader(this, (_: any) => ({
      stateKey: `tokenb_approve`,
      onCallSuccess: success,
      onCallError: err,
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.TokenB)
        const tokenB = this.getTokenBContract(addr)
        const thePoolAddr = getAddressOfToken(TokenNames.ThePool)

        try {
          const value = toWei(`${Number.MAX_SAFE_INTEGER}`)

          const gasPrice = await this.$web3.eth.getGasPrice()
          const gas = await tokenB.methods.approve(thePoolAddr, value).estimateGas()
          const params = {
            gas: gas,
            gasPrice: gasPrice
          }

          const res = await tokenB.methods.approve(thePoolAddr, value).send(params)
          return res
        } catch (err: any) {
          const errmsg = this.$web3Helper.errorMessage(err)
          throw new Error(errmsg)
        }
      }
    }))
  }

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
    amount: string,
    success: (IStatus) => void = null, 
    err: (IStatus) => void = null): ContractLoader {
    
    return new ContractLoader(this, (_: any) => ({
      stateKey: 'mint_tokena',
      onCallSuccess: success,
      onCallError: err,
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.TokenA)
        const contract = this.getTokenAContract(addr)
        const amountA = toWei(amount)

        try {
          const gasPrice = await this.$web3.eth.getGasPrice()
          const gas = await contract.methods.mint(amountA).estimateGas()
          const params = {
            gas: gas,
            gasPrice: gasPrice
          }

          const res = await contract.methods.mint(amountA).send(params)
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

  getThePoolContract(addr: string): ThePool {
    return new this.$web3.eth.Contract(ThePoolContract.abi as AbiItem[], addr, {
      from: this.walletAddress
    }) as any as ThePool
  }

  mintTokenB(
    amount: string,
    success: (IStatus) => void = null, 
    err: (IStatus) => void = null): ContractLoader {
    
    return new ContractLoader(this, (_: any) => ({
      stateKey: 'mint_tokenb',
      onCallSuccess: success,
      onCallError: err,
      handle: async () => {
        const addr = getAddressOfToken(TokenNames.TokenB)
        const contract = this.getTokenBContract(addr)
        const amountB = toWei(amount)
        try {

          const gasPrice = await this.$web3.eth.getGasPrice()
          const gas = await contract.methods.mint(amountB).estimateGas()
          const params = {
            gas: gas,
            gasPrice: gasPrice
          }

          const res = await contract.methods.mint(amountB).send(params)
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