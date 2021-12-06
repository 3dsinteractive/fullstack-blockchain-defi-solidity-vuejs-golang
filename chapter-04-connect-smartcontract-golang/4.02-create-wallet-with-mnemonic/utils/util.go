package utils

import (
	"context"
	"fmt"
	"math/big"
	"runtime"

	"github.com/3dsinteractive/fullstackblockchain/consts"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	hdwallet "github.com/miguelmota/go-ethereum-hdwallet"
	"github.com/shopspring/decimal"
)

func Print(format string, val ...interface{}) {
	fmt.Printf(format+"\n", val...)
}

func LogE(err error) error {
	if err != nil {
		_, fn, line, _ := runtime.Caller(1)
		fmt.Println(err.Error(), fmt.Sprintf("%s:%d", fn, line))
	}
	return err
}

func LogM(msg string) {
	fmt.Println(msg)
}

// FromWei wei to decimals
func FromWei(ivalue interface{}) decimal.Decimal {
	value := new(big.Int)
	switch v := ivalue.(type) {
	case string:
		value.SetString(v, 10)
	case *big.Int:
		value = v
	default:
		value.SetString(fmt.Sprintf("%v", v), 10)
	}

	mul := decimal.NewFromFloat(float64(10)).Pow(decimal.NewFromFloat(float64(18)))
	num, _ := decimal.NewFromString(value.String())
	result := num.Div(mul)

	return result
}

func ToBasis(percent float32) *big.Int {
	basis := int64(percent * 100)
	wei := new(big.Int)
	wei.SetInt64(basis)
	return wei
}

// ToWei decimals to wei
func ToWei(iamount interface{}) *big.Int {
	amount := decimal.NewFromFloat(0)
	switch v := iamount.(type) {
	case string:
		amount, _ = decimal.NewFromString(v)
	case float32:
		amount = decimal.NewFromFloat(float64(v))
	case float64:
		amount = decimal.NewFromFloat(v)
	case int:
		amount = decimal.NewFromFloat(float64(v))
	case int32:
		amount = decimal.NewFromFloat(float64(v))
	case int64:
		amount = decimal.NewFromFloat(float64(v))
	case decimal.Decimal:
		amount = v
	case *decimal.Decimal:
		amount = *v
	default:
		amount, _ = decimal.NewFromString(fmt.Sprintf("%v", v))
	}

	mul := decimal.NewFromFloat(float64(10)).Pow(decimal.NewFromFloat(float64(18)))
	result := amount.Mul(mul)

	wei := new(big.Int)
	wei.SetString(result.String(), 10)

	return wei
}

func MyAccountPath(network consts.Network) string {
	return fmt.Sprintf("m/44'/60'/0'/0/%d", 0)
}

func MyAccountAddress(client *ethclient.Client, network consts.Network) (common.Address, error) {
	myWallet, err := MyWallet(network)
	if err != nil {
		return consts.AddressZero(), LogE(err)
	}

	path := hdwallet.MustParseDerivationPath(MyAccountPath(network))
	myAccount, err := myWallet.Derive(path, false)
	if err != nil {
		return consts.AddressZero(), LogE(err)
	}
	addr, err := myWallet.Address(myAccount)
	if err != nil {
		return consts.AddressZero(), LogE(err)
	}
	return addr, nil
}

func MySendOpt(client *ethclient.Client, network consts.Network) *bind.TransactOpts {
	myWallet, err := MyWallet(network)
	if err != nil {
		LogE(err)
		return nil
	}
	path := hdwallet.MustParseDerivationPath(MyAccountPath(network))
	myAccount, err := myWallet.Derive(path, false)
	if err != nil {
		LogE(err)
		return nil
	}
	privateKey, err := myWallet.PrivateKey(myAccount)
	if err != nil {
		LogE(err)
		return nil
	}

	nonce, err := client.PendingNonceAt(context.Background(), myAccount.Address)
	if err != nil {
		LogE(err)
		return nil
	}

	chainID, err := client.ChainID(context.Background())
	if err != nil {
		LogE(err)
		return nil
	}
	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainID)
	if err != nil {
		LogE(err)
		return nil
	}

	auth.Nonce = big.NewInt(int64(nonce))
	auth.Value = big.NewInt(0) // wei
	if network == consts.GanacheCLI {
		auth.GasLimit = uint64(6721975)
	} else {
		auth.GasLimit = uint64(8000000)
	}

	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		LogE(err)
	}
	auth.GasPrice = gasPrice

	return auth
}

func MyWallet(network consts.Network) (*hdwallet.Wallet, error) {
	mnemonic := "unveil wave nuclear maple strike prepare luxury story brush knife senior modify"
	if network == consts.GanacheCLI {
		mnemonic = "unveil wave nuclear maple strike prepare luxury story brush knife senior modify"
	} else if network == consts.BSCTest {
		mnemonic = "unveil wave nuclear maple strike prepare luxury story brush knife senior modify"
	}
	wallet, err := hdwallet.NewFromMnemonic(mnemonic)
	if err != nil {
		return nil, LogE(err)
	}

	return wallet, nil
}
