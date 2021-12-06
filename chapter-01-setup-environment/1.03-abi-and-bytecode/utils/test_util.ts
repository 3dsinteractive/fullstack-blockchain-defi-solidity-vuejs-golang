import Web3 from 'web3';

export const gasLimit = 6721975

export interface TestActors {
  ownerAddr: string
  ownerTx: any
  acc1Addr: string
  acc1Tx: any
  acc2Addr: string
  acc2Tx: any
  platformAddr: string
}

export const testActors = async (web3:Web3): Promise<TestActors> => {
  const accounts = await web3.eth.getAccounts()
  return {
    ownerAddr: accounts[0],
    ownerTx: {from: accounts[0], gas: gasLimit},
    acc1Addr: accounts[1],
    acc1Tx: {from: accounts[1], gas: gasLimit},
    acc2Addr: accounts[2],
    acc2Tx: {from: accounts[2], gas: gasLimit},
    platformAddr: accounts[9],
  }
}
