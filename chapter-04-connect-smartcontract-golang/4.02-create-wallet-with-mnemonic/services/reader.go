package services

import (
	"github.com/3dsinteractive/fullstackblockchain/consts"
	"github.com/3dsinteractive/fullstackblockchain/utils"
)

type Reader struct {
	cfg consts.IConfig
}

func NewReader(cfg consts.IConfig) *Reader {
	return &Reader{
		cfg: cfg,
	}
}

func (svc *Reader) Read() error {
	cfg := svc.cfg

	client, err := consts.GetClient(cfg.Network())
	if err != nil {
		return utils.LogE(err)
	}

	accountAddr, err := utils.MyAccountAddress(client, cfg.Network())
	if err != nil {
		return utils.LogE(err)
	}

	utils.Print("account address = %s", accountAddr.String())

	return nil
}
