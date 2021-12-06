import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
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

let theContract: TheContract

beforeEach(async () => {
  const actors = await testActors(web3)
  // 1. Deploy theContract contract
  theContract = new web3.eth.Contract(TheContractContract.abi as AbiItem[]) as any as TheContract
  theContract = await theContract.deploy({data: TheContractContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as TheContract
})

describe('The Contract', () => {
  it('can set storage and memory variables', async () => {
    const actors = await testActors(web3)

    // 1. Mapping storage vs memory
    await theContract.methods.setMyMappingUseStorage('15', true).send(actors.acc1Tx)
    await theContract.methods.setMyMappingUseMemory('25', true).send(actors.acc1Tx)
    let val1 = await theContract.methods.getMyMapping('15').call(actors.acc1Tx)
    let val2 = await theContract.methods.getMyMapping('25').call(actors.acc1Tx)
    expect(val1).toEqual(true)
    expect(val2).toEqual(false)

    // 2. Array storage vs memory
    await theContract.methods.addMyArray(false).send(actors.acc1Tx)
    await theContract.methods.addMyArray(false).send(actors.acc1Tx)
    await theContract.methods.setMyArrayUseStorage('0', true).send(actors.acc1Tx)
    await theContract.methods.setMyArrayUseMemory('1', true).send(actors.acc1Tx)
    val1 = await theContract.methods.getMyArray('0').call(actors.acc1Tx)
    val2 = await theContract.methods.getMyArray('1').call(actors.acc1Tx)
    expect(val1).toEqual(true)
    expect(val2).toEqual(false)

    // 3. Struct storage and memory
    await theContract.methods.setMyStructUseStorage(true).send(actors.acc1Tx)
    val1 = await theContract.methods.getMyStruct().call(actors.acc1Tx)
    expect(val1).toEqual(true)
    await theContract.methods.setMyStructUseMemory(false).send(actors.acc1Tx)
    val1 = await theContract.methods.getMyStruct().call(actors.acc1Tx)
    expect(val1).toEqual(true)

    // 4. Bytes storage and memory
    const a = toBytes32('a')
    const b = toBytes32('b')
    const c = toBytes32('c')
    await theContract.methods.addMyBytes(a).send(actors.acc1Tx)
    await theContract.methods.addMyBytes(b).send(actors.acc1Tx)
    await theContract.methods.addMyBytes(c).send(actors.acc1Tx)
    await theContract.methods.setMyBytesUseStorage('0', c).send(actors.acc1Tx)
    await theContract.methods.setMyBytesUseMemory('1', c).send(actors.acc1Tx)
    let str1 = await theContract.methods.getMyBytes('0').call(actors.acc1Tx)
    let str2 = await theContract.methods.getMyBytes('1').call(actors.acc1Tx)
    expect(str1).toEqual(c)
    expect(str2).toEqual(b)

    // 5. calldata with cheapter gas
    let tx = await theContract.methods.setMyStringUseMemory('hello').send(actors.acc1Tx)
    tx = await theContract.methods.setMyStringUseMemory('hello 1').send(actors.acc1Tx)
    console.log('memory gas used = ', tx.gasUsed)
    tx = await theContract.methods.setMyStringUseCalldata('hello 2').send(actors.acc1Tx)
    console.log('calldata gas used = ', tx.gasUsed)
  })

})