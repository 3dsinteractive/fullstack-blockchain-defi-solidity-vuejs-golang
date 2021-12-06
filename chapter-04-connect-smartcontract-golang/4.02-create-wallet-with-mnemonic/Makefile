default:
	echo 'nothing to do as default'
install-ganache:
	yarn global add ganache-cli
start-ganache:
	ganache-cli --verbose --mnemonic "unveil wave nuclear maple strike prepare luxury story brush knife senior modify"
go-init:
	go mod init github.com/3dsinteractive/fullstackblockchain
go-get:
	go get
go-build:
	go build .
go-run-reader:
	NETWORK=ganache-cli \
	SERVICE_ID=reader \
	go run .
go-run-deployer:
	NETWORK=ganache-cli \
	SERVICE_ID=deployer \
	go run .