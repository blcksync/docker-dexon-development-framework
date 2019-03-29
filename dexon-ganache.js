const ganache = require("@dexon-foundation/ganache-cli")

/**
 * These are pre-defined files to pick up a pre-configured key sets
 * so we can import them as our test keys into Ganache.
 * A similar approach can be found here https://github.com/matr1xc0in/ganache-cli/blob/dockerize-it/run-keys.sh
 * as well. There are various ways to import keys or re-generate keys by mnemonic.
 * - secret.js
 */
const secret = require('./secret')
const mnemonic = process.env.MNEMONIC || secret.custom_mnemonic
const {
  PORT = 7545,
  NETWORK_ID = 5777,
} = process.env

const yargs = require("yargs");
const pkg = require("./package.json");
const initArgs = require("./args")
const BN = require("bn.js");
const detailedVersion = "Ganache CLI v" + pkg.version + " (ganache-core: " + ganache.version + ")";
var logger = console;

var isDocker = "DOCKER" in process.env && process.env.DOCKER.toLowerCase() === "true";
var argv = initArgs(yargs, detailedVersion, isDocker).argv;

function parseAccounts(accounts) {
  function splitAccount(account) {
    account = account.split(',')
    return {
      secretKey: account[0],
      balance: account[1]
    };
  }

  if (typeof accounts === 'string')
    return [ splitAccount(accounts) ];
  else if (!Array.isArray(accounts))
    return;

  var ret = []
  for (var i = 0; i < accounts.length; i++) {
    ret.push(splitAccount(accounts[i]));
  }
  return ret;
}

const options = {
  port: PORT,
  hostname: argv.h,
  debug: argv.debug,
  seed: argv.s,
  mnemonic: mnemonic,
  total_accounts: argv.a,
  default_balance_ether: argv.e,
  blockTime: argv.b,
  gasPrice: argv.g,
  gasLimit: argv.l,
  accounts: parseAccounts(argv.account),
  unlocked_accounts: argv.unlock,
  fork: argv.f,
  network_id: NETWORK_ID,
  verbose: argv.v,
  secure: argv.n,
  db_path: argv.db,
  account_keys_path: argv.acctKeys,
  vmErrorsOnRPCResponse: !argv.noVMErrorsOnRPCResponse,
  logger: logger,
  allowUnlimitedContractSize: argv.allowUnlimitedContractSize,
  time: argv.t,
  keepAliveTimeout: argv.keepAliveTimeout,
  hdPath: "m/44'/237'/0'/0/",
}

const server = ganache.server(options);

server.listen(PORT, function(err, blockchain) {
  if (err) {
    console.log(err);
    return;
  }

  var state = blockchain ? blockchain : server.provider.manager.state;

  console.log("");
  console.log("Available Accounts");
  console.log("==================");

  var accounts = state.accounts;
  var addresses = Object.keys(accounts);

  addresses.forEach(function(address, index) {
    var balance = new BN(accounts[address].account.balance).divRound(new BN("1000000000000000000")).toString();
    var line = "(" + index + ") " + address + " (~" + balance + " ETH)";

    if (state.isUnlocked(address) == false) {
      line += " 🔒";
    }

    console.log(line);
  });

  console.log("");
  console.log("Private Keys");
  console.log("==================");

  addresses.forEach(function(address, index) {
    console.log("(" + index + ") " + "0x" + accounts[address].secretKey.toString("hex"));
  });

  if (options.account_keys_path != null) {
    console.log("");
    console.log("Saving accounts and keys to " + options.account_keys_path);
    var obj = {}
    obj.addresses = accounts;
    obj.private_keys = {};
    addresses.forEach(function(address, index) {
       obj.private_keys[address] = accounts[address].secretKey.toString("hex");
    });
    var json = JSON.stringify(obj);
    fs.writeFile(options.account_keys_path, json, 'utf8',function(err){
      if(err) throw err;
    })
  }

  if (options.accounts == null) {
    console.log("");
    console.log("HD Wallet");
    console.log("==================");
    console.log("Mnemonic:      " + state.mnemonic);
    console.log("Base HD Path:  " + state.wallet_hdpath + "{account_index}")
  }

  if (options.gasPrice) {
    console.log("");
    console.log("Gas Price");
    console.log("==================");
    console.log(options.gasPrice);
  }

  if (options.gasLimit) {
    console.log("");
    console.log("Gas Limit");
    console.log("==================");
    console.log(options.gasLimit);
  }

  console.log("");
  console.log("Listening on " + options.hostname + ":" + PORT);
})
