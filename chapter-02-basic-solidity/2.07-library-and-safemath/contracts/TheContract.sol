// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 1. MySafeMath is the library use for prevent number overflow 
//    and underflow from arithmetic operation
library MySafeMath {
  function add(uint a, uint b) internal pure returns(uint) {
    uint c = a + b;
    require(c >= a, 'overflow');
    return c;
  }

  function sub(uint a, uint b) internal pure returns(uint) {
    // Actually solidity >= 0.8.x will revert automatically if found overflow/underflow
    // but we can skip the default behavior using unchcked scope
    unchecked {
      uint c = a - b;
      require(c <= a, 'underflow');
      return c;
    }
  }

  function div(uint a, uint b) internal pure returns(uint) {
    require(b != 0, 'div by zero');
    uint c = a / b;
    return c;
  }
}

// 2. Logger is library meanth to be reused log function
library Logger {
  event Log(string message);

  function log(string memory message) internal {
    emit Log(message);
  }
}

contract TheContract {
  // 3. The contract will use MySafeMath for all uint
  using MySafeMath for uint;

  function add(uint a, uint b) public pure returns(uint) {
    return a.add(b);
  }

  function sub(uint a, uint b) public pure returns(uint) {
    return a.sub(b);
  }

  function div(uint a, uint b) public pure returns(uint) {
    return a.div(b);
  }

  // 4. The contract will use Logger as library
  function log(string memory message) public {
    Logger.log(message);
  }
}