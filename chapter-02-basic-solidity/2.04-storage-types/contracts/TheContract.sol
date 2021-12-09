// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TheContract {
  // 1. Storage types
  // - Storage store on the blockchain (Most expensive)
  // - Memory store in memory (Medium cost)
  // - Calldata store in stack (Less cost)

  struct MyStruct {
    bool myBool;
  }

  // Variables declare at this scope is in storage
  mapping(uint => MyStruct) private _myMappings;
  MyStruct[] private _myArrays;
  MyStruct private _myStruct;
  bytes private _myBytes;
  string private _myString;

  // 2. Variable that has the following type, need to declare with storage types
  // - Mapping
  // - Dynamic Array and string
  // - Struct

  // 3. When read from storage mapping we must specify memory type
  // - Use storage if you want to modify the original storage data
  // - Use memory if you don't want to modify the original storage data
  function setMyMappingUseStorage(uint id, bool value) public {
    MyStruct storage myStruct = _myMappings[id];
    myStruct.myBool = value;
  }

  function setMyMappingUseMemory(uint id, bool value) public view {
    MyStruct memory myStruct = _myMappings[id];
    myStruct.myBool = value;
  }

  function getMyMapping(uint id) public view returns(bool) {
    return _myMappings[id].myBool;
  }

  // 5. When read from storage array we must specify memory type
  // - Use storage if you want to modify the original storage data
  // - Use memory if you don't want to modify the original storage data
  function addMyArray(bool value) public {
    _myArrays.push(MyStruct({
      myBool: value
    }));
  }

  function setMyArrayUseStorage(uint i, bool value) public {
    MyStruct storage myStruct = _myArrays[i];
    myStruct.myBool = value;
  }

  function setMyArrayUseMemory(uint i, bool value) public view {
    MyStruct memory myStruct = _myArrays[i];
    myStruct.myBool = value;
  }

  function getMyArray(uint i) public view returns(bool) {
    return _myArrays[i].myBool;
  }

  // 6. When read from storage struct we must specify memory type
  // - Use storage if you want to modify the original storage data
  // - Use memory if you don't want to modify the original storage data
  function setMyStructUseStorage(bool value) public {
    MyStruct storage myStruct = _myStruct;
    myStruct.myBool = value;
  }

  function setMyStructUseMemory(bool value) public view {
    MyStruct memory myStruct = _myStruct;
    myStruct.myBool = value;
  }

  function getMyStruct() public view returns(bool) {
    return _myStruct.myBool;
  }

  // 7. When read from storage bytes we must specify memory type
  // - Use storage if you want to modify the original storage data
  // - Use memory if you don't want to modify the original storage data
  function addMyBytes(bytes1 value) public {
    _myBytes.push(value);
  }

  function setMyBytesUseStorage(uint i, bytes1 value) public {
    bytes storage myBytes = _myBytes;
    myBytes[i] = value;
  }

  function setMyBytesUseMemory(uint i, bytes1 value) public view {
    bytes memory myBytes = _myBytes;
    myBytes[i] = value;
  }

  function getMyBytes(uint i) public view returns(bytes1) {
    return _myBytes[i];
  }

  // 8. Calldata can be declare in external function only, and it will have cheaper gas than memory
  function setMyStringUseCalldata(string calldata myString) external {
    _myString = myString;
  }

  function setMyStringUseMemory(string memory myString) public {
    _myString = myString;
  }
}