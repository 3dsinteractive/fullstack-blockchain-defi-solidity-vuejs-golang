import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
import { TheOracle } from '../types/web3-v1-contracts/TheOracle'
import TheOracleContract from '../build/contracts/TheOracle.json'
import { TheContract } from '../types/web3-v1-contracts/TheContract'
import TheContractContract from '../build/contracts/TheContract.json'
import {beforeEach, describe, it, jest} from '@jest/globals'
import {
  getWeb3, 
  toWei, 
  toBasis, 
  toBN, 
  fromWei,
  zeroBN,
  toBytes32,
  fromBytes32,
} from '../utils/util'
import { 
  testActors
} from '../utils/test_util'

const ganacheOpts = {
  // verbose: true,
  // logger: console,
}
const web3 = getWeb3(ganache.provider(ganacheOpts))

let theOracle: TheOracle
let theContract: TheContract

beforeEach(async () => {
  const actors = await testActors(web3)

  // 1. Deploy Oracle contract
  theOracle = new web3.eth.Contract(TheOracleContract.abi as AbiItem[]) as any as TheOracle
  theOracle = await theOracle.deploy({data: TheOracleContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as TheOracle

  // 2. Get oracle address
  const theOracleAddr = theOracle.options.address

  // 3. Deploy theContract contract
  theContract = new web3.eth.Contract(TheContractContract.abi as AbiItem[]) as any as TheContract
  theContract = await theContract.deploy({data: TheContractContract.bytecode, arguments:[theOracleAddr]})
    .send(actors.ownerTx) as any as TheContract
})

describe('The Contract', () => {
  it('can use price from oracle', async () => {
    const actors = await testActors(web3)
    const key = toBytes32('BTC/DAI')
    await theOracle.methods.addUpdater(actors.acc1Addr, true).send(actors.ownerTx)
    // 1 BTC = 50,000 DAI
    await theOracle.methods.updatePrice(key, '50000').send(actors.acc1Tx)

    // Try swap BTC/DAI from theContract 
    const poolId = toBytes32('BTC/DAI')
    await theContract.methods.swap(poolId, toWei('1')).send(actors.acc2Tx)

    // Validate the result from events (swap 1 BTC for 50K DAI)
    const events = await theContract.getPastEvents('Swap', {
      filter: {},
      fromBlock: 0,
    })
    expect(events.length).toEqual(1)
    expect(events[0].returnValues['sender']).toEqual(actors.acc2Addr)
    expect(fromWei(events[0].returnValues['amountIn'])).toEqual('1')
    expect(fromWei(events[0].returnValues['amountOut'])).toEqual('50000')
  })
})