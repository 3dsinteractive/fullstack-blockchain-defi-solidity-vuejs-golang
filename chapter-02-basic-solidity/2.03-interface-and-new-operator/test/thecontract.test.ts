import expect from 'expect'
import ganache from 'ganache-cli'
import { AbiItem } from 'web3-utils'
import { GameC } from '../types/web3-v1-contracts/GameC'
import { GameController } from '../types/web3-v1-contracts/GameController'
import GameCContract from '../build/contracts/GameC.json'
import GameControllerContract from '../build/contracts/GameController.json'
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

let gameC: GameC
let gameController: GameController

beforeEach(async () => {
  const actors = await testActors(web3)
  // 1. Deploy gameC contract
  gameC = new web3.eth.Contract(GameCContract.abi as AbiItem[]) as any as GameC
  gameC = await gameC.deploy({data: GameCContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as GameC

  // 2. Deploy GameController
  gameController = new web3.eth.Contract(GameControllerContract.abi as AbiItem[]) as any as GameController
  gameController = await gameController.deploy({data: GameControllerContract.bytecode, arguments:[]})
    .send(actors.ownerTx) as any as GameController
})

describe('Game Controller', () => {
  it('can start and stop each game by name', async () => {
    const actors = await testActors(web3)

    // 1. Get gameC address to send as the parameter for register game
    const gameCAddr = gameC.options.address
    const gameCName = toBytes32('GameC')
    await gameController.methods.registerGame(gameCName, gameCAddr).send(actors.acc1Tx)

    // 2. Test start/stop games
    let gameName = toBytes32('GameA')
    let response = await gameController.methods.startGame(gameName).call(actors.acc1Tx)
    expect(fromBytes32(response)).toEqual('GameA Start')

    response = await gameController.methods.stopGame(gameName).call(actors.acc1Tx)
    expect(fromBytes32(response)).toEqual('GameA Stop')

    gameName = toBytes32('GameB')
    response = await gameController.methods.startGame(gameName).call(actors.acc1Tx)
    expect(fromBytes32(response)).toEqual('GameB Start')

    response = await gameController.methods.stopGame(gameName).call(actors.acc1Tx)
    expect(fromBytes32(response)).toEqual('GameB Stop')

    gameName = toBytes32('GameC')
    response = await gameController.methods.startGame(gameName).call(actors.acc1Tx)
    expect(fromBytes32(response)).toEqual('GameC Start')

    response = await gameController.methods.stopGame(gameName).call(actors.acc1Tx)
    expect(fromBytes32(response)).toEqual('GameC Stop')
  })

})