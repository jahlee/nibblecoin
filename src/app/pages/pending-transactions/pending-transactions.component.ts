import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../../blockchain';
import { BlockchainService } from './../../services/blockchain.service';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.scss']
})
export class PendingTransactionsComponent implements OnInit {

  public pendingTransactions: Transaction[] = []

  constructor(private blockchainService: BlockchainService) { 
    this.pendingTransactions = blockchainService.getPendingTransactions()
  }

  ngOnInit(): void {
  }

  minePendingTransactions() {
    this.blockchainService.minePendingTransactions();
  }

}
