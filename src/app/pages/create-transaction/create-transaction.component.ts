import { BlockchainService } from './../../services/blockchain.service';
import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../../blockchain';
import { Key } from 'src/app/interfaces/key';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})

export class CreateTransactionComponent implements OnInit {

  public newTx!: Transaction;
  public walletKey: Key;

  constructor(private blockchainService: BlockchainService) { 
    this.walletKey = blockchainService.walletKeys[0];
  }

  ngOnInit(): void {
    this.newTx = new Transaction();
  }

  createTransaction() {
    this.newTx.fromAddress = this.walletKey.publicKey;
    this.newTx.signTransaction(this.walletKey.keyObject);

    this.blockchainService.addTransaction(this.newTx);

    this.newTx = new Transaction();
  }

}
