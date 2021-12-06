// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGame{
  struct Player {
    address playerAddr;
    uint level;
  }

  function startGame() external returns(bytes32);

  function stopGame() external returns(bytes32);
}

contract GameA is IGame {
  mapping(address => Player) _players;
  
  function startGame() public pure returns(bytes32) {
    // GameA implementation of startGame
    return 'GameA Start';
  }

  function stopGame() public pure returns(bytes32) {
    // GameB implementation of startGame
    return 'GameA Stop';
  }
}

contract GameB is IGame {
  mapping(address => Player) _players;

  function startGame() external pure returns(bytes32) {
    // GameB implementation of startGame
    return 'GameB Start';
  }

  function stopGame() external pure returns(bytes32) {
    // GameB implementation of startGame
    return 'GameB Stop';
  }
}

contract GameC is IGame {
  mapping(address => Player) _players;

  function startGame() external pure returns(bytes32) {
    // GameB implementation of startGame
    return 'GameC Start';
  }

  function stopGame() external pure returns(bytes32) {
    // GameB implementation of startGame
    return 'GameC Stop';
  }
}

contract GameController {
  mapping(bytes32 => IGame) private _games;

  constructor() {
    _games['GameA'] = new GameA();
    _games['GameB'] = new GameB();
  }

  function registerGame(bytes32 gameName, address gameAddr) public {
    require(address(_games[gameName]) == address(0), 'duplicate game');
    _games[gameName] = IGame(gameAddr);
  }

  function startGame(bytes32 gameName) public returns(bytes32) {
    require(address(_games[gameName]) != address(0), 'game not register');
    return _games[gameName].startGame();
  }

  function stopGame(bytes32 gameName) public returns(bytes32) {
    require(address(_games[gameName]) != address(0), 'game not register');
    return _games[gameName].stopGame();
  }
}