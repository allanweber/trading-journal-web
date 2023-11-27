import {
  CandlestickChart,
  Landmark,
  Percent,
  PiggyBank,
  Wallet,
} from 'lucide-react';
export enum EntryType {
  Trade = 'TRADE',
  Withdrawal = 'WITHDRAWAL',
  Deposit = 'DEPOSIT',
  Taxes = 'TAXES',
  Dividend = 'DIVIDEND',
}

export const getEntries = [
  {
    type: EntryType.Trade,
    icon: CandlestickChart,
  },
  {
    type: EntryType.Withdrawal,
    icon: Wallet,
  },
  {
    type: EntryType.Deposit,
    icon: PiggyBank,
  },
  {
    type: EntryType.Taxes,
    icon: Landmark,
  },
  {
    type: EntryType.Dividend,
    icon: Percent,
  },
];

export const getEntryType = (type: EntryType) =>
  getEntries.find((d) => d.type === type);
