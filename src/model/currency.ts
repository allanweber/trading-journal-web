export const currencies = [
  { value: 'USD', label: 'Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'BRL', label: 'Real', symbol: 'R$' },
];

export function getSymbol(currencyCode: string): string {
  const currency = currencies.find((c) => c.value === currencyCode);
  if (currency) return currency.symbol;
  return '$';
}
