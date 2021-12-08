package services

import (
	"context"

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

	// 1. Explain consts.GetClient that will connect to chain by configuration
	client, err := consts.GetClient(cfg.Network())
	if err != nil {
		return utils.LogE(err)
	}

	block, err := client.BlockNumber(context.Background())
	if err != nil {
		return utils.LogE(err)
	}

	utils.Print("Successfull connect to ganache-cli at block = %d", block)

	return nil
}
