import { mountForm, fmt } from '../calc-form.ts';

const form = document.getElementById('discount-calculator-form') as HTMLFormElement;
const money = (n: number) => '$' + fmt(Math.round(n * 100) / 100);

mountForm(form, (r) => {
  const price = r.num('price', 'the original price', { min: 0 });
  const discount = r.num('discount', 'the discount percent', { min: 0, max: 100 });

  const discountAmount = (discount / 100) * price;
  const salePrice = price - discountAmount;

  return {
    lines: [
      { label: 'Sale price', value: money(salePrice), primary: true },
      { label: `You save (${fmt(discount)}% off)`, value: money(discountAmount) },
      { label: 'Original price', value: money(price) },
    ],
    steps: [
      `Discount amount: ${fmt(discount)}% of ${money(price)} = ${fmt(discount)} ÷ 100 × ${money(price)} = ${money(discountAmount)}`,
      `Sale price: ${money(price)} − ${money(discountAmount)} = ${money(salePrice)}`,
      `Shortcut: ${fmt(discount)}% off means you pay ${fmt(100 - discount)}% of the price → ${money(price)} × ${fmt((100 - discount) / 100)} = ${money(salePrice)}`,
    ],
  };
});
