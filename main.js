const SHA256 = require('crypto-js/sha256');


class Block {
  
  /**
   * 
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
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}

class Blockchain {
  
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  /**
   * Creates first/genesis block
   */
  createGenesisBlock() {
    return new Block(0, Date(), "Genesis block", "0")
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  // make sure chain is never deleted or is unneccessarily changed
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
nibbleCoin.addBlock(new Block(1, Date(), {amount: 4}))
nibbleCoin.addBlock(new Block(2, Date(), {amount: 10}))

console.log(JSON.stringify(nibbleCoin, null, 2));
console.log(nibbleCoin.isChainValid());

nibbleCoin.chain[1].data = {amount: 100};
console.log(nibbleCoin.isChainValid());
nibbleCoin.chain[1].hash = nibbleCoin.chain[1].calculateHash();
console.log(nibbleCoin.isChainValid());