// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract TheLand is Ownable, ERC721URIStorage{

  constructor() ERC721('TheLand', 'TheLand') {
  }

  function mint(address toAddr, uint landId, string memory landURI) public {
    require(!_exists(landId), 'landId is exists');
    _mint(toAddr, landId);
    _setTokenURI(landId, landURI);
  }
}