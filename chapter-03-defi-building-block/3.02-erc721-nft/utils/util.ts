import Web3 from 'web3'
import BN from 'bn.js'

export const getNetwork = (): string => {
  return process.env.NETWORK
}

export const getChainId = (): string => {
  const network = getNetwork()
  switch (network) {
    case 'bsctest': return '0x61'
    case 'bscmain': return '0x38'
  }
  return ''
}

export const getWeb3 = (provider: any): Web3 => {
  const web3 = new Web3(provider)
  return web3
}

export const toBasis = (percent: number): BN => {
  const basis = percent * 100
  return new BN(basis, 10)
}

export const toWei = (amount: string): BN => {
  if (!amount || amount.length == 0) {
    return new BN(0, 10)
  }
  const wei = Web3.utils.toWei(amount)
  return new BN(wei, 10)
}

export const toBytes32 = (str: string): string => {
  return Web3.utils.stringToHex(str)
}

export const fromBytes32 = (str: string): string => {
  return Web3.utils.hexToString(str)
}

export const toBN = (amount: string): BN => {
  return new BN(amount, 10)
}

export const fromWei = (amount: string): string => {
  try {
    return Web3.utils.fromWei(amount)
  } catch (err:any) {
    return ''
  }
}

export const zeroBN = new BN(0, 10)
export const zeroAddr = '0x0000000000000000000000000000000000000000'
export const oneoneAddr = '0x1111111111111111111111111111111111111111'
export const ninenineAddr = '0x9999999999999999999999999999999999999999'