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

	tokenAAddr, tokenATx, _, err := tokena.DeployTokena(utils.MySendOpt(client, network), client)
	if err != nil {
		return utils.LogE(err)
	}
	tokenBAddr, tokenBTx, _, err := tokenb.DeployTokenb(utils.MySendOpt(client, network), client)
	if err != nil {
		return utils.LogE(err)
	}
	thePoolAddr, thePoolTx, _, err := thepool.DeployThepool(utils.MySendOpt(client, network), client, tokenAAddr, tokenBAddr)
	if err != nil {
		return utils.LogE(err)
	}

	utils.Print(`TOKENA_TX=%s \`, tokenATx.Hash().Hex())
	utils.Print(`TOKENB_TX=%s \`, tokenBTx.Hash().Hex())
	utils.Print(`THEPOOL_TX=%s \`, thePoolTx.Hash().Hex())
	utils.Print("-------------")
	utils.Print(`TOKENA_ADDR=%s \`, tokenAAddr.String())
	utils.Print(`TOKENB_ADDR=%s \`, tokenBAddr.String())
	utils.Print(`THEPOOL_ADDR=%s \`, thePoolAddr.String())
	utils.Print(`TOKENA_ADDR: process.env.APP_TOKENA_ADDR || '%s',`, tokenAAddr.String())
	utils.Print(`TOKENB_ADDR: process.env.APP_TOKENB_ADDR || '%s',`, tokenBAddr.String())
	utils.Print(`THEPOOL_ADDR: process.env.APP_THEPOOL_ADDR || '%s',`, thePoolAddr.String())

	return nil
}
