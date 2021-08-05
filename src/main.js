const {Blockchain, Transaction} = require('./blockchain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('2c9c1a1c0189b6bdaa91fea374145a3b3575d544e4ab98f00c6379deb28b42db')
const myWalletAddress = myKey.getPublic('hex');

let nibbleCoin = new Blockchain();

// give 10 coins to address of public key
const tx1 = new Transaction(myWalletAddress, '<public key goes here>', 10);
// sign it
tx1.signTransaction(myKey);
// add it to the queue
nibbleCoin.addTransaction(tx1);

// need to mine the transaction
console.log('\nstarting miner')
nibbleCoin.minePendingTransactions(myWalletAddress)
// check new balance 
console.log('\nBalance of josh is: ' + nibbleCoin.getBalanceOfAddress(myWalletAddress))

// valid
console.log(nibbleCoin.isChainValid());

// invalid
nibbleCoin.chain[1].transactions[0].amount = 1;
console.log(nibbleCoin.isChainValid());