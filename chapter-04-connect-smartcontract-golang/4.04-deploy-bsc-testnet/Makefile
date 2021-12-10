default:
	echo 'nothing to do as default'
install-ganache:
	yarn global add ganache-cli
start-ganache:
	ganache-cli --verbose --mnemonic "unveil wave nuclear maple strike prepare luxury story brush knife senior modify"
yarn-init:
	yarn global add ganache-cli
	yarn add -D truffle 
	yarn add -D @chainsafe/truffle-plugin-abigen 
	yarn add -D @openzeppelin/contracts
go-init:
	go mod init github.com/3dsinteractive/fullstackblockchain
go-get:
	go get
go-build:
	go build .
go-run:
	NETWORK=bsctest \
	SERVICE_ID= \
	go run .
go-run-reader:
	NETWORK=bsctest \
	SERVICE_ID=reader \
	SEED_GANACHE="unveil wave nuclear maple strike prepare luxury story brush knife senior modify" \
	SEED_BSCTEST="unveil wave nuclear maple strike prepare luxury story brush knife senior modify" \
	SEED_BSCMAIN="" \
	TOKENA_ADDR= \
	TOKENB_ADDR= \
	THEPOOL_ADDR= \
	go run .
go-run-writer:
	NETWORK=bsctest \
	SERVICE_ID=writer \
	SEED_GANACHE="unveil wave nuclear maple strike prepare luxury story brush knife senior modify" \
	SEED_BSCTEST="unveil wave nuclear maple strike prepare luxury story brush knife senior modify" \
	SEED_BSCMAIN="" \
	TOKENA_ADDR= \
	TOKENB_ADDR= \
	THEPOOL_ADDR= \
	go run .
go-run-deployer:
	NETWORK=bsctest \
	SERVICE_ID=deployer \
	SEED_GANACHE="unveil wave nuclear maple strike prepare luxury story brush knife senior modify" \
	SEED_BSCTEST="unveil wave nuclear maple strike prepare luxury story brush knife senior modify" \
	SEED_BSCMAIN="" \
	go run .
truffle-compile:
	yarn truffle compile
	yarn truffle run abigen
	if [ ! -d bindings ]; then mkdir bindings ; fi
	if [ ! -d bindings/tokena ]; then mkdir bindings/tokena ; fi
	abigen --abi=abigenBindings/abi/TokenA.abi --bin=abigenBindings/bin/TokenA.bin --pkg tokena --out bindings/tokena/bindings.go
	if [ ! -d bindings/tokenb ]; then mkdir bindings/tokenb ; fi
	abigen --abi=abigenBindings/abi/TokenB.abi --bin=abigenBindings/bin/TokenB.bin --pkg tokenb --out bindings/tokenb/bindings.go
	if [ ! -d bindings/thepool ]; then mkdir bindings/thepool ; fi
	abigen --abi=abigenBindings/abi/ThePool.abi --bin=abigenBindings/bin/ThePool.bin --pkg thepool --out bindings/thepool/bindings.go
	