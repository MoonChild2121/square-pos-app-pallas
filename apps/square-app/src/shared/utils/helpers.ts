import { CURRENCY_CODE, LOCALE } from '../constants';

export const formatMoney = (amount: number) => {
  return (amount / 100).toLocaleString(LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
  });
};
