# dexon-decvelopment-framework
A set of docker images to encapsulate all necessary development tools
for Solidity development with Truffle framework for Dexon block chain.
This includes all necessary toolings for any usres to download, configure,
and deploy their solidity contract and make it easy for anyone to use as our goal.
By default, `ganache` unlocks all 10 wallet during launch.

3 files are provided for you to configure the environment.
- truffle.env
- truffle.js
- secret.js
It includes:
* Setting the mnenomic seed for BIP39 for deterministic keys. **Please do NOT use the
example mnenomic keys anywhere else**. You will LOSE your DEX.
* Pre-configure the docker host alias name `dexon-ganache` for ganache access
* Utilize env variable `MNENOMIC` to override

## To build your truffle env docker image
```
./build.sh
```

## To build dexon's ganache docker image to simulate blockchain
```
./build_ganache.sh
```

## To run both and share the same wallets, settings, etc. for deployment, testing, etc.

### Configuring credentials and private keys for testing and deployment

We use docker-compose here to kick off both truffle env and ganache. They will share
the same env variable `MNENOMIC` defined in `truffle.env`. This will be automatically picked
up since we use env variables to pass this inside the docker container.

### `truffle.env`: A local file that contains 2 environment variables to configure.
#### **MNENOMIC**: The 12/16 word phrase to import private keys for testing and deployment inside the docker container.
#### **INFURA_API_KEY**: The Infura API token/key to utilize Infura to relay the signed transaction for you. This is fine because you have already signed your transaction offline in your container environment. The Infura API provides you a convinient proxy to interact with the Ethereum blockchain without you running a full node locally. The signed transaction is protected by your private key and won't be altered during the entire submission. Currently, I don't know if Infura supports Dexon, however, it will perhaps derive similar end results when this is point to a local node.

```
# Clean up old images first for fresh download, make sure we are using the latest images
docker-compose -f dexon.yml down --rmi all
docker-compose -f dexon.yml up
```

### Login to our Truffle environment to compile, migrate, and deploy contracts
The following command brings you into the Docker container, and give you a command prompt
to run `dexon-truffle` commands to compile, migrate, and deploy your contracts.
```
docker exec -it $(docker ps | grep 'blcksync/dexon-development-framework:latest' | cut -d " " -f1) bash
```

## To run the docker images one by one.

**NOTE:** They do NOT share the same env variables, etc. You will need to customize these
on your own during runtime.

### To run the truffle env docker image for development
```
./run.sh
```

### To run ganache docker image for testing
```
run_ganache.sh
```

Be aware, Dexon's HD path is different. Make sure you have verified them first in both
`truffle migrate --network=testnet --dry-run` and ganache output.
```
Base HD Path:  m/44'/237'/0'/0/{account_index}
```

## Some Examples

**A local directory ./deploy will be created and mounted into your docker container**.
This preserves the work you create in the container so it doesn't get deleted/wiped out when
you exist the container. Make sure you are working under the `/root/deploy` directory.

After you run it, a command prompt will show up, now, you can simply run the `truffle` command
as you like, e.g.
```
cd /root/deploy
mkdir myfirst_project
cd myfirst_project
# The following is broken in truffle 4.x, just checkout some code
# dexon-truffle init
git clone -b develop https://github.com/truffle-box/react-box.git
cd react-box
cp /root/secret.js ./secret.js
cp /root/truffle.js ./truffle.js
dexon-truffle compile
dexon-truffle test --network=development
dexon-truffle migrate --network=development
cd ..
```

or from a pre-built box provided by the community, e.g. hello-world https://github.com/dexon-foundation/hello-dexon.git
```
cd /root/deploy
git clone https://github.com/dexon-foundation/hello-dexon.git
cd hello-dexon
cp /root/secret.js ./secret.js
cp /root/truffle.js ./truffle.js
dexon-truffle compile
dexon-truffle test --network=development
dexon-truffle migrate --network=development
cd ..
```

and another example,
```
cd /root/deploy
git clone https://github.com/dexon-foundation/dapp-workshop.git
cd dapp-workshop
cp /root/secret.js ./secret.js
cp /root/truffle.js ./truffle.js
dexon-truffle compile
dexon-truffle test --network=development
dexon-truffle migrate --network=development
cd ..
```

Truffle migrate will not work unless you provide a local Dexon [ganache-cli](https://github.com/dexon-foundation/ganache-cli.git)
or use [Infura](https://truffleframework.com/tutorials/using-infura-custom-provider). The ganache docker image provided here is a
customized ganache to apply `@dexon-foundation/ganache-core` and a new HDpath.
You can simply run `run_ganache.sh` and use the ganache provided here.
