const SHA256 = require('crypto-js/sha256');


class Block {
  
  /**
   * Constructor.
   * @param {int} index - index of block in the chain
   * @param {string} timestamp - time of creation/edit
   * @param {object} data - data of transactions
   * @param {string} previousHash - previous hash for integrity of chain
   */
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // random value to change hash
  }

  /**
   * Calculates hash.
   * @returns SHA256 hash of our block
   */
  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
    this.difficulty = 4;
  }

  /**
   * Creates first/genesis block
   */
  createGenesisBlock() {
    return new Block(0, Date(), "Genesis block", "0")
  }

  /**
   * Gets last block of chain.
   * @returns Last block of chain
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Adds a block to the end of the chain
   * @param {Block} newBlock - block to be added
   */
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
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
console.log('Mining block 1...')
nibbleCoin.addBlock(new Block(1, Date(), {amount: 4}))
console.log('Mining block 2...')
nibbleCoin.addBlock(new Block(2, Date(), {amount: 10}))
