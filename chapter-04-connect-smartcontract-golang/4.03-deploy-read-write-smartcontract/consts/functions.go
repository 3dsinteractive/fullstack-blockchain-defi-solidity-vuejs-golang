package consts

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func GetClient(network Network) (*ethclient.Client, error) {
	networkURL := ""
	if network == GanacheCLI {
		networkURL = "http://localhost:8545"
	} else if network == BSCTest {
		networkURL = "https://data-seed-prebsc-2-s2.binance.org:8545/"
	} else if network == BSCMain {
		networkURL = "https://bsc-dataseed.binance.org/"
	}

	client, err := ethclient.Dial(networkURL)
	if err != nil {
		return nil, err
	}

	return client, nil
}

func AddressZero() common.Address {
	return common.HexToAddress("0x0")
}
