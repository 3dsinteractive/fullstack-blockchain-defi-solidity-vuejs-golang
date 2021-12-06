package main

import (
	"github.com/3dsinteractive/fullstackblockchain/consts"
	"github.com/3dsinteractive/fullstackblockchain/services"
)

func main() {
	cfg := consts.NewConfig()
	serviceID := cfg.ServiceID()
	switch serviceID {
	case "reader":
		services.NewReader(cfg).Read()
	case "deployer":
		services.NewDeployer(cfg).Deploy()
	}
}
