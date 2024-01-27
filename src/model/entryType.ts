import { BadgePercent, CandlestickChart, Coins, Landmark, PiggyBank, Wallet } from "lucide-react";

export enum EntryType {
  STOCK = "STOCK",
  DIVIDEND = "DIVIDEND",
  WITHDRAWAL = "WITHDRAWAL",
  DEPOSIT = "DEPOSIT",
  TAXES = "TAXES",
  FEES = "FEES",
}

export const getEntries = [
  {
    type: EntryType.STOCK,
    icon: CandlestickChart,
  },
  {
    type: EntryType.DIVIDEND,
    icon: Coins,
  },
  {
    type: EntryType.WITHDRAWAL,
    icon: Wallet,
  },
  {
    type: EntryType.DEPOSIT,
    icon: PiggyBank,
  },
  {
    type: EntryType.TAXES,
    icon: Landmark,
  },
  {
    type: EntryType.FEES,
    icon: BadgePercent,
  },
];

export const getEntryType = (type: EntryType) => getEntries.find((d) => d.type === type);

export const onlyPortfolioBalances = () => {
  return getEntries.filter(
    (d) =>
      d.type === EntryType.WITHDRAWAL ||
      d.type === EntryType.DEPOSIT ||
      d.type === EntryType.TAXES ||
      d.type === EntryType.FEES
  );
};

export const onlyTrades = () => {
  return getEntries.filter((d) => d.type === EntryType.STOCK || d.type === EntryType.DIVIDEND);
};
