package consts

import (
	"os"
)

type Network string

const (
	GanacheCLI Network = "ganache-cli"
	BSCTest    Network = "bsctest"
	BSCMain    Network = "bscmain"
)

type IConfig interface {
	Network() Network
	ServiceID() string
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
