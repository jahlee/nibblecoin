const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  /**
   * Sign hash with private key
   */
  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
  }

  /**
   * sender needs to sign transaction to verify it
   * @param {Key} signingKey - key of from address
   */
  signTransaction(signingKey) {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error("You can't sign transactions for other wallets");
    }

    // hash of transaction
    const hashTx = this.calculateHash();
    // signature
    const sig = signingKey.sign(hashTx, 'base64');
    // format signature to hex
    this.signature = sig.toDER('hex');
  }

  /**
   * Check transaction is valid
   * @returns True/False
   */
  isValid() {
    // reward for mining
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    // verify hash of block has been signed
    return publicKey.verify(this.calculateHash(), this.signature);
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

  /**
   * Iterate through all transactions and make sure all are valid.
   * @returns True/False
   */
  hasValidTransaction() {
    for (const transaction of this.transactions) {
      if (!transaction.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class Blockchain {
  
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
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
    // add reward for mining in queue
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    // add this transaction to the block
    let block = new Block(Date(), this.pendingTransactions, this.getLatestBlock().hash);
    // mine the block
    block.mineBlock(this.difficulty);
    console.log("Block successfully mined");

    // add block to chain
    this.chain.push(block);

    // clear transaction queue
    this.pendingTransactions = [];
  }

  /**
   * Create a transaction
   * @param {Transaction} transaction 
   */
  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must have from and to address');
    }

    if (!transaction.isValid()) {
      throw new Error('Transaction is invalid')
    }
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
    // skip first/genesis block
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i-1];

      if (!currentBlock.hasValidTransaction()) {
        return false;
      }

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

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;