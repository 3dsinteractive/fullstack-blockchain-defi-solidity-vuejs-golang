package main

import (
	"context"

	"github.com/3dsinteractive/fullstackblockchain/consts"
	"github.com/3dsinteractive/fullstackblockchain/services"
	"github.com/3dsinteractive/fullstackblockchain/utils"
)

func main() {
	cfg := consts.NewConfig()

	serviceID := cfg.ServiceID()
	switch serviceID {
	case "reader":
		services.NewReader(cfg).Read()
	case "writer":
		services.NewWriter(cfg).Write()
	case "deployer":
		services.NewDeployer(cfg).Deploy()
	default:
		PrintMyBNB(cfg)
	}
}

func PrintMyBNB(cfg *consts.Config) error {
	network := cfg.Network()
	client, err := consts.GetClient(cfg.Network())
	if err != nil {
		return utils.LogE(err)
	}
	myAddr, err := utils.MyAccountAddress(client, network)
	if err != nil {
		return utils.LogE(err)
	}

	nativeBalance, err := client.BalanceAt(context.Background(), myAddr, nil)
	if err != nil {
		return utils.LogE(err)
	}

	utils.Print("my public address: %s", myAddr.String())
	utils.Print("my BNB amount: %s", utils.FromWei(nativeBalance).String())

	return nil
}
