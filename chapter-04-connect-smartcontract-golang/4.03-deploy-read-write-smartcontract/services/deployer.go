package services

import (
	"github.com/3dsinteractive/fullstackblockchain/bindings/thepool"
	"github.com/3dsinteractive/fullstackblockchain/bindings/tokena"
	"github.com/3dsinteractive/fullstackblockchain/bindings/tokenb"
	"github.com/3dsinteractive/fullstackblockchain/consts"
	"github.com/3dsinteractive/fullstackblockchain/utils"
)

type Deployer struct {
	cfg consts.IConfig
}

func NewDeployer(cfg consts.IConfig) *Deployer {
	return &Deployer{
		cfg: cfg,
	}
}

func (svc *Deployer) Deploy() error {
	cfg := svc.cfg
	network := cfg.Network()

	client, err := consts.GetClient(cfg.Network())
	if err != nil {
		return utils.LogE(err)
	}

	// 1. Deploy TokenA contract
	tokenAAddr, _, _, err := tokena.DeployTokena(utils.MySendOpt(client, network), client)
	if err != nil {
		return utils.LogE(err)
	}
	// 2. Deploy TokenB contract
	tokenBAddr, _, _, err := tokenb.DeployTokenb(utils.MySendOpt(client, network), client)
	if err != nil {
		return utils.LogE(err)
	}
	// 3. Deploy ThePool Contract
	thePoolAddr, _, _, err := thepool.DeployThepool(utils.MySendOpt(client, network), client, tokenAAddr, tokenBAddr)
	if err != nil {
		return utils.LogE(err)
	}

	// 4. Print address of all contract to used later
	utils.Print(`TOKENA_ADDR=%s \`, tokenAAddr.String())
	utils.Print(`TOKENB_ADDR=%s \`, tokenBAddr.String())
	utils.Print(`THEPOOL_ADDR=%s \`, thePoolAddr.String())

	return nil
}
