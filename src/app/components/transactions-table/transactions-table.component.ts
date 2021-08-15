import { Transaction } from '../../../blockchain';
import { BlockchainService } from './../../services/blockchain.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {

  @Input() public transactions: Transaction[] = [];

  constructor(public blockchainService: BlockchainService) { }

  ngOnInit(): void {
  }

}
