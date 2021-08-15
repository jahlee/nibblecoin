import { Injectable, KeyValueDiffers } from '@angular/core';
import { Blockchain, Transaction } from '../../blockchain'
import { ec } from 'elliptic';
import { Key } from '../interfaces/key';

@Injectable({
  providedIn: 'root'
})

export class BlockchainService {
  public blockchainInstance = new Blockchain();
  public walletKeys: Key[] = [];

  constructor() { 
    this.blockchainInstance.difficulty = 1;
    this.blockchainInstance.minePendingTransactions('my-wallet-address');
    this.generateWalletKeys();
  }

  getBlocks() {
    return this.blockchainInstance.chain;
  }

  addressIsFromCurrentUser(address: string) {
    return address === this.walletKeys[0].publicKey;
  }

  addTransaction(tx: Transaction) {
    this.blockchainInstance.addTransaction(tx);
  }

  getPendingTransactions() {
    return this.blockchainInstance.pendingTransactions;
  }

  minePendingTransactions() {
    this.blockchainInstance.minePendingTransactions(
      this.walletKeys[0].publicKey
    )
  }

  private generateWalletKeys() {
    const EC = new ec('secp256k1');
    const key = EC.genKeyPair();

    this.walletKeys.push({
      keyObject: key,
      publicKey: key.getPublic('hex'),
      privateKey: key.getPrivate('hex')
    })
  }
}
