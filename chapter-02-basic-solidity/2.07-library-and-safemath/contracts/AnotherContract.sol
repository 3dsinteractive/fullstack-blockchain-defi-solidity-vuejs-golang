// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// 5. This is sample of how to use SafeMath library from Openzeppelin
contract AnotherContract {
  using SafeMath for uint;

  function add(uint a, uint b) public pure returns(uint) {
    return a.add(b);
  }

  function sub(uint a, uint b) public pure returns(uint) {
    return a.sub(b);
  }

  function div(uint a, uint b) public pure returns(uint) {
    return a.div(b);
  }
}