const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  
  /**
   * Constructor.
   * @param {String} timestamp - time of creation/edit
   * @param {Array} transactions - transactions
   * @param {String} previousHash - previous hash for integrity of chain
   */
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // random value to change hash
  }

  /**
   * Calculates hash.
   * @returns SHA256 hash of our block
   */
  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  /**
   * Will increase nonce until hash suffices.
   * @param {int} difficulty - replicate difficulty of mining problem
   */
  mineBlock(difficulty) {
    // while substring (first X characters) of hash is not all 0's
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined: " + this.hash);
  }
}

class Blockchain {
  
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 10;
  }

  /**
   * Creates first/genesis block
   */
  createGenesisBlock() {
    return new Block(Date(), "Genesis block", "0")
  }

  /**
   * Gets last block of chain.
   * @returns Last block of chain
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Mine next block in list of transactions
   * @param {string} miningRewardAddress 
   */
  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined");
    this.chain.push(block);

    // after mining all transactions, you will be rewarded when next person mines
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  /**
   * Create a transaction
   * @param {Transaction} transaction 
   */
  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  /**
   * Iterate through block chain to calculate total balance
   * @param {String} address 
   */
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }

        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }
    return balance;
  }

  /**
   * Make sure chain is never deleted or is unneccessarily changed.
   * @returns True/False
   */
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i-1];

      // check hash is correct
      if (currentBlock.hash !== currentBlock.calculateHash())
        return false;

      // check previous hash
      if (currentBlock.previousHash !== previousBlock.hash)
        return false;
    }
    return true;
  }
}

let nibbleCoin = new Blockchain();
nibbleCoin.createTransaction(new Transaction('address1', 'address2', 100));
nibbleCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nstarting miner')
nibbleCoin.minePendingTransactions('joshs-address')
console.log('\nBalance of josh is: ' + nibbleCoin.getBalanceOfAddress('joshs-address'))

console.log('\nstarting miner again')
nibbleCoin.minePendingTransactions('joshs-address')
console.log('\nBalance of josh is: ' + nibbleCoin.getBalanceOfAddress('joshs-address'))