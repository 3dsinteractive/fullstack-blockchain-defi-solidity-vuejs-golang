// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library MySafeMath {
  function add(uint a, uint b) internal pure returns(uint) {
    uint c = a + b;
    require(c >= a, 'overflow');
    return c;
  }

  function sub(uint a, uint b) internal pure returns(uint) {
    uint c = a - b;
    require(c <= a, 'undeflow');
    return c;
  }

  function div(uint a, uint b) internal pure returns(uint) {
    require(b != 0, 'div by zero');
    uint c = a / b;
    return c;
  }
}

library Logger {
  event Log(string message);

  function log(string memory message) internal {
    emit Log(message);
  }
}

contract TheContract {
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

  function log(string memory message) public {
    Logger.log(message);
  }
}