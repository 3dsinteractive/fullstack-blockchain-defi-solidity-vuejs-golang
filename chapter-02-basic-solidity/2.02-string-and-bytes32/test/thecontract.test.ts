import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
import { TheContract } from '../types/web3-v1-contracts/TheContract'
import TheContractContract from '../build/contracts/TheContract.json'
import { AnotherContract } from '../types/web3-v1-contracts/AnotherContract'
import AnotherContractContract from '../build/contracts/AnotherContract.json'
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
let anotherContract: AnotherContract

beforeEach(async () => {
  const actors = await testActors(web3)
  // 1. Deploy the contract
  theContract = new web3.eth.Contract(TheContractContract.abi as AbiItem[]) as any as TheContract
  theContract = await theContract.deploy({data: TheContractContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as TheContract

  // 2. Get TheContract address to send as the parameter for AntoherContract
  const theContractAddr = theContract.options.address

  // 3. Deploy AnotherContract
  anotherContract = new web3.eth.Contract(AnotherContractContract.abi as AbiItem[]) as any as AnotherContract
  anotherContract = await anotherContract.deploy({data: AnotherContractContract.bytecode, arguments:[theContractAddr]})
    .send(actors.ownerTx) as any as AnotherContract
})

describe('The Contract', () => {
  it('can set and get string', async () => {
    const actors = await testActors(web3)

    // 1. Test send hello world and get it back by single contract
    const tx = await theContract.methods.setMyString('hello world').send(actors.acc1Tx)

    console.log('string gas usage = ', tx.gasUsed)
    let myString = await theContract.methods.getMyString().call()
    expect(myString).toEqual('hello world')

    // String longer than 32 bytes
    await theContract.methods.setMyString('aaaaabbbbbcccccdddddeeeeefffffggggg').send(actors.acc1Tx)
    myString = await theContract.methods.getMyString().call()
    expect(myString).toEqual('aaaaabbbbbcccccdddddeeeeefffffggggg')
  })

  it('can set and get string by another contract', async () => {
    const actors = await testActors(web3)

    // 2. Test send hello world and get it back contract to contract
    await anotherContract.methods.setMyString('hello world').send(actors.acc1Tx)
    let myString = await anotherContract.methods.getMyString().call()
    expect(myString).toEqual('hello world')

    // String longer than 32 bytes
    await anotherContract.methods.setMyString('aaaaabbbbbcccccdddddeeeeefffffggggg').send(actors.acc1Tx)
    myString = await anotherContract.methods.getMyString().call()
    expect(myString).toEqual('aaaaabbbbbcccccdddddeeeeefffffggggg')
  })

  it('can set and get bytes32', async () => {
    const actors = await testActors(web3)

    // 3. Test send hello world (as bytes32) and get it back by single contract
    let myBytes32 = toBytes32('hello world')
    // console.log('mybytes = ', myBytes32)
    const tx = await theContract.methods.setMyBytes32(myBytes32).send(actors.acc1Tx)
    console.log('bytes gas usage = ', tx.gasUsed)
    let myString = await theContract.methods.getMyBytes32().call()
    // console.log('mystring = ', myString)
    expect(fromBytes32(myString)).toEqual('hello world')

    // 4. Test send สวัสดี as bytes32 and get it back
    myBytes32 = toBytes32('สวัสดี')
    // console.log('mybytes = ', myBytes32)
    await theContract.methods.setMyBytes32(myBytes32).send(actors.acc1Tx)
    myString = await theContract.methods.getMyBytes32().call()
    // console.log('mystring = ', myString)
    expect(fromBytes32(myString)).toEqual('สวัสดี')
    
    // 5. Test send 32 ascii characters as bytes32 and get it back
    myBytes32 = toBytes32('aaaaabbbbbcccccdddddeeeeefffffgg')
    // console.log('mybytes = ', myBytes32)
    await theContract.methods.setMyBytes32(myBytes32).send(actors.acc1Tx)
    myString = await theContract.methods.getMyBytes32().call()
    // console.log('mystring = ', myString)
    expect(fromBytes32(myString)).toEqual('aaaaabbbbbcccccdddddeeeeefffffgg')

    // 6. Test send 10 Thai utf-8 as bytes32 and get it back (10 Thai char = 30 bytes)
    myBytes32 = toBytes32('กกกกกขขขขข')
    // console.log('mybytes = ', myBytes32)
    await theContract.methods.setMyBytes32(myBytes32).send(actors.acc1Tx)
    myString = await theContract.methods.getMyBytes32().call()
    // console.log('mystring = ', myString)
    expect(fromBytes32(myString)).toEqual('กกกกกขขขขข')
  })

  it('can set and get bytes32 from another contract', async () => {
    const actors = await testActors(web3)

    // 7. Test send hello world (as bytes32) and get it back by single contract
    let myBytes32 = toBytes32('hello world')
    // console.log('mybytes = ', myBytes32)
    await anotherContract.methods.setMyBytes32(myBytes32).send(actors.acc1Tx)
    let myString = await anotherContract.methods.getMyBytes32().call()
    // console.log('mystring = ', myString)
    expect(fromBytes32(myString)).toEqual('hello world')

    // 8. Test send สวัสดี as bytes32 and get it back
    myBytes32 = toBytes32('สวัสดี')
    // console.log('mybytes = ', myBytes32)
    await anotherContract.methods.setMyBytes32(myBytes32).send(actors.acc1Tx)
    myString = await anotherContract.methods.getMyBytes32().call()
    // console.log('mystring = ', myString)
    expect(fromBytes32(myString)).toEqual('สวัสดี')
    
    // 9. Test send 32 ascii characters as bytes32 and get it back
    myBytes32 = toBytes32('aaaaabbbbbcccccdddddeeeeefffffgg')
    // console.log('mybytes = ', myBytes32)
    await anotherContract.methods.setMyBytes32(myBytes32).send(actors.acc1Tx)
    myString = await anotherContract.methods.getMyBytes32().call()
    // console.log('mystring = ', myString)
    expect(fromBytes32(myString)).toEqual('aaaaabbbbbcccccdddddeeeeefffffgg')

    // 10. Test send 10 Thai utf-8 as bytes32 and get it back (10 Thai char = 30 bytes)
    myBytes32 = toBytes32('กกกกกขขขขข')
    // console.log('mybytes = ', myBytes32)
    await anotherContract.methods.setMyBytes32(myBytes32).send(actors.acc1Tx)
    myString = await anotherContract.methods.getMyBytes32().call()
    // console.log('mystring = ', myString)
    expect(fromBytes32(myString)).toEqual('กกกกกขขขขข')
  })

  it('can set and get mapping string', async () => {
    const actors = await testActors(web3)

    // 11. Test send hello world string as key in mapping
    const tx = await theContract.methods.setStringMap('hello world', true).send(actors.acc1Tx)
    console.log('string map gas usage = ', tx.gasUsed)
    let myBool = await theContract.methods.getStringMap('hello world').call()
    expect(myBool).toEqual(true)

    // String longer than 32 bytes
    await theContract.methods.setStringMap('aaaaabbbbbcccccdddddeeeeefffffggggg', true).send(actors.acc1Tx)
    myBool = await theContract.methods.getStringMap('aaaaabbbbbcccccdddddeeeeefffffggggg').call()
    expect(myBool).toEqual(true)
  })

  it('can set and get mapping bytes32', async () => {
    const actors = await testActors(web3)

    // 12. Test send hello world string as key in mapping
    const bytes32Key = toBytes32('hello world')
    const tx = await theContract.methods.setBytes32Map(bytes32Key, true).send(actors.acc1Tx)
    console.log('bytes32 map gas usage = ', tx.gasUsed)
    let myBool = await theContract.methods.getBytes32Map(bytes32Key).call()
    expect(myBool).toEqual(true)
    
  })

})