// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Helloworld {
  string private _message;

  function helloworld() public view returns (string memory) {
    return _message;
  }

  function setMessage(string memory message) public {
    _message = message;
  }
}