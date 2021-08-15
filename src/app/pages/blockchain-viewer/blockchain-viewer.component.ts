import { Block } from './../../interfaces/block';
import { BlockchainService } from './../../services/blockchain.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blockchain-viewer',
  templateUrl: './blockchain-viewer.component.html',
  styleUrls: ['./blockchain-viewer.component.scss']
})
export class BlockchainViewerComponent implements OnInit {
  public blocks: Block[] = [];
  public selectedBlock: Block;

  constructor(private BlockchainService: BlockchainService) { 
    this.blocks = BlockchainService.getBlocks();
    this.selectedBlock = this.blocks[0];
  }

  ngOnInit(): void {
  }

  showTransactions(block: Block) {
    this.selectedBlock = block;
  }

}
