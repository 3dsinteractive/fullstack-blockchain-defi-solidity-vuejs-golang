// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

contract TheContract {
  IERC721 private _theLand;

  mapping(uint => address) _holders;

  constructor(address theLandAddr) {
    _theLand = IERC721(theLandAddr);
  }

  function deposit(uint tokenId) public {
    _holders[tokenId] = msg.sender;
    _theLand.transferFrom(msg.sender, address(this), tokenId);
  }

  function withdraw(uint tokenId) public {
    require(_holders[tokenId] == msg.sender, 'not a holder');
    _holders[tokenId] = address(0);
    _theLand.transferFrom(address(this), msg.sender, tokenId);
  }
}