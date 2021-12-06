package consts

import (
	"os"

	"github.com/ethereum/go-ethereum/common"
)

type Network string

const (
	GanacheCLI Network = "ganache-cli"
	BSCTest    Network = "bsctest"
	BSCMain    Network = "bscmain"
)

type Token string

const (
	TokenA  Token = "TOKENA"
	TokenB  Token = "TOKENB"
	ThePool Token = "THE_POOL"
)

type IConfig interface {
	Network() Network
	ServiceID() string
	AddressOfToken(token Token) common.Address
}
type Config struct {
}

func NewConfig() *Config {
	return &Config{}
}

func (cfg *Config) Network() Network {
	return Network(os.Getenv("NETWORK"))
}

func (cfg *Config) ServiceID() string {
	return os.Getenv("SERVICE_ID")
}

func (cfg *Config) AddressOfToken(token Token) common.Address {
	switch token {
	case TokenA:
		return common.HexToAddress(os.Getenv("TOKENA_ADDR"))
	case TokenB:
		return common.HexToAddress(os.Getenv("TOKENB_ADDR"))
	case ThePool:
		return common.HexToAddress(os.Getenv("THEPOOL_ADDR"))
	}
	return common.HexToAddress("")
}
