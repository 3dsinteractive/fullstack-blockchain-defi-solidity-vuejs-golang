pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';

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