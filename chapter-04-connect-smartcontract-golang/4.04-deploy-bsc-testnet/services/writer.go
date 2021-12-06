package services

import (
	"time"

	"github.com/3dsinteractive/fullstackblockchain/bindings/thepool"
	"github.com/3dsinteractive/fullstackblockchain/bindings/tokena"
	"github.com/3dsinteractive/fullstackblockchain/bindings/tokenb"
	"github.com/3dsinteractive/fullstackblockchain/consts"
	"github.com/3dsinteractive/fullstackblockchain/utils"
)

type Writer struct {
	cfg consts.IConfig
}

func NewWriter(cfg consts.IConfig) *Writer {
	return &Writer{
		cfg: cfg,
	}
}

func (svc *Writer) Write() error {
	cfg := svc.cfg
	network := cfg.Network()

	client, err := consts.GetClient(cfg.Network())
	if err != nil {
		return utils.LogE(err)
	}

	tokenA, err := tokena.NewTokena(cfg.AddressOfToken(consts.TokenA), client)
	if err != nil {
		return utils.LogE(err)
	}

	amount1ml := utils.ToWei("1000000")
	_, err = tokenA.Mint(utils.MySendOpt(client, network), amount1ml)
	if err != nil {
		return utils.LogE(err)
	}

	tokenB, err := tokenb.NewTokenb(cfg.AddressOfToken(consts.TokenB), client)
	if err != nil {
		return utils.LogE(err)
	}

	amount10ml := utils.ToWei("10000000")
	_, err = tokenB.Mint(utils.MySendOpt(client, network), amount10ml)
	if err != nil {
		return utils.LogE(err)
	}

	thePool, err := thepool.NewThepool(cfg.AddressOfToken(consts.ThePool), client)
	if err != nil {
		return utils.LogE(err)
	}

	_, err = tokenA.Approve(utils.MySendOpt(client, network), cfg.AddressOfToken(consts.ThePool), amount1ml)
	if err != nil {
		return utils.LogE(err)
	}
	_, err = tokenB.Approve(utils.MySendOpt(client, network), cfg.AddressOfToken(consts.ThePool), amount10ml)
	if err != nil {
		return utils.LogE(err)
	}
	_, err = thePool.AddLiquidity(utils.MySendOpt(client, network), amount1ml, amount10ml)
	if err != nil {
		return utils.LogE(err)
	}

	myAddr, err := utils.MyAccountAddress(client, network)
	if err != nil {
		return utils.LogE(err)
	}
	time.Sleep(5 * time.Second)
	lpTokenAmount, err := thePool.BalanceOf(nil, myAddr)
	if err != nil {
		return utils.LogE(err)
	}

	utils.Print("My LP Tokens = %s", utils.FromWei(lpTokenAmount).String())
	return nil
}
