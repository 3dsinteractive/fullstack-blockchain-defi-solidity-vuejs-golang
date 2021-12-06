// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TheContract {
  string private _myString;
  bytes32 private _myBytes32;
  mapping(string => bool) _myStringMap;
  mapping(bytes32 => bool) _myBytes32Map;

  function setMyString(string memory myString) public {
    _myString = myString;
  }
  function getMyString() public view returns(string memory) {
    return _myString;
  }

  function setMyBytes32(bytes32 myBytes32) public {
    _myBytes32 = myBytes32;
  }
  function getMyBytes32() public view returns(bytes32) {
    return _myBytes32;
  }

  function setStringMap(string memory key, bool value) public {
    _myStringMap[key] = value;
  }
  function getStringMap(string memory key) public view returns(bool) {
    return _myStringMap[key];
  }

  function setBytes32Map(bytes32 key, bool value) public {
    _myBytes32Map[key] = value;
  }
  function getBytes32Map(bytes32 key) public view returns(bool) {
    return _myBytes32Map[key];
  }
}

contract AnotherContract {
  TheContract private _theContract;

  constructor(address theContractAddr) {
    _theContract = TheContract(theContractAddr);
  }

  function setMyString(string memory myString) public {
    _theContract.setMyString(myString);
  }
  function getMyString() public view returns(string memory) {
    return _theContract.getMyString();
  }

  function setMyBytes32(bytes32 myBytes32) public {
    _theContract.setMyBytes32(myBytes32);
  }
  function getMyBytes32() public view returns(bytes32) {
    return _theContract.getMyBytes32();
  }
}