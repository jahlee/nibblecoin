import { Transaction } from 'src/blockchain';
export interface Block {
  transactions: Transaction[],
  previousHash: string,
  timestamp: string,
  nonce: number,
  hash: string
}
