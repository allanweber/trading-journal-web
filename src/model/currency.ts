export const currencies = [
  { value: 'USD', symbol: '$' },
  { value: 'EUR', symbol: '€' },
  { value: 'BRL', symbol: 'R$' },
];

export function getSymbol(currencyCode: string): string {
  const currency = currencies.find((c) => c.value === currencyCode);
  if (currency) return currency.symbol;
  return '$';
}
