package services

import (
	"context"

	"github.com/3dsinteractive/fullstackblockchain/bindings/thepool"
	"github.com/3dsinteractive/fullstackblockchain/consts"
	"github.com/3dsinteractive/fullstackblockchain/utils"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
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

	// 1. Create ThePool contract using address from ENV
	thePool, err := thepool.NewThepool(cfg.AddressOfToken(consts.ThePool), client)
	if err != nil {
		return utils.LogE(err)
	}

	providers := []common.Address{}

	filter := &bind.FilterOpts{
		Start:   0,
		End:     nil,
		Context: context.Background(),
	}

	// 2. Filter all "AddLiquidity" events and print out to console
	//    in real application this might used to index the data into custom database to use offchain such as SubGraph
	addLPEvents, err := thePool.FilterAddLiquidity(filter, providers)
	if err != nil {
		return utils.LogE(err)
	}
	for addLPEvents.Next() {
		utils.Print("event: AddLiquidity Provider: %s Amount: %s",
			addLPEvents.Event.Provider.String(),
			utils.FromWei(addLPEvents.Event.Amount).String())
	}

	return nil
}
