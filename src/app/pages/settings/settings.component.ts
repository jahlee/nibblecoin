import { BlockchainService } from './../../services/blockchain.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public blockchain;

  constructor(private blockchainService: BlockchainService) { 
    this.blockchain = blockchainService.blockchainInstance;
  }

  ngOnInit(): void {
  }

}
