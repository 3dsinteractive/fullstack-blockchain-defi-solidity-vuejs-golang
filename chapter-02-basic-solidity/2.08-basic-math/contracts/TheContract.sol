// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TheContract {
  uint private constant BASIS_100 = 10000;

  function percentOf(uint percent, uint ofValue) public pure returns(uint) {
    return ofValue * percent / BASIS_100;
  }
}