---
title: "Order of Operations (PEMDAS / BODMAS)"
description: "Learn the order to solve maths problems with several operations, so brackets, powers, multiplication, and addition all come out right."
topic: arithmetic
published: 2026-09-30
calculators: [scientific]
quiz: arithmetic
related: [negative-numbers, how-to-calculate-a-percentage]
---

Last term a student argued with me for a full five minutes that 3 + 4 × 5 is 35. His logic: you just go left to right. He was so confident that half the class started doubting themselves.

He was wrong, but I understood why. When a sum has more than one operation, the order you work in changes the answer. Add first and you get 35. Multiply first and you get 23. Maths needed one agreed answer, so it settled on one agreed order. Learn it once and you will never argue about it again.

## The rule in one word

Two memory words for the same order: PEMDAS and BODMAS.

- **P / B** : Parentheses or Brackets, ( )
- **E / O** : Exponents or Orders, powers and roots like 5² or √9
- **MD** : Multiplication and Division
- **AS** : Addition and Subtraction

Work down the list. Brackets first, then powers, then multiply and divide, then add and subtract.

One detail people miss: multiplication and division are equals. Same with addition and subtraction. When two operations share a rank, you go left to right as they appear. You do not always multiply before dividing. That is the single most failed exam point in this topic.

## Worked example 1

Solve 3 + 4 × 5.

1. No brackets, no powers.
2. Multiply: 4 × 5 = 20.
3. Now add: 3 + 20 = 23.

So 3 + 4 × 5 = 23. The multiplication jumped the queue even though the addition was written first. That is the whole point of the rule.

## Worked example 2

Solve (6 + 2)² ÷ 4 − 3.

1. Brackets first: 6 + 2 = 8. The sum becomes 8² ÷ 4 − 3.
2. Power next: 8² = 64. Now it is 64 ÷ 4 − 3.
3. Divide: 64 ÷ 4 = 16. Now it is 16 − 3.
4. Subtract: 16 − 3 = 13.

The answer is 13.

## Worked example 3

Solve 20 − 2 × (3 + 4).

1. Brackets first: 3 + 4 = 7. Now it is 20 − 2 × 7.
2. Multiply: 2 × 7 = 14. Now it is 20 − 14.
3. Subtract: 20 − 14 = 6.

The answer is 6.

## Left to right, when ranks are equal

Solve 24 ÷ 6 × 2. Same rank, so read left to right.

1. 24 ÷ 6 = 4.
2. 4 × 2 = 8.

If you multiplied first instead, you would do 6 × 2 = 12, then 24 ÷ 12 = 2. Wrong. Left to right is not a suggestion here. It is the rule.

## Mistakes I mark wrong every year

- **Adding before subtracting no matter what.** In 10 − 4 + 2, go left to right: 10 − 4 = 6, then 6 + 2 = 8. Adding 4 + 2 first gives 4, which is wrong.
- **Multiplying before dividing no matter what.** They are equals. 8 ÷ 4 × 2 is 4, not 1.
- **Skipping the brackets.** In 2 × (3 + 4), the inside comes first. It is not 2 × 3 + 4.
- **Squaring the wrong thing.** In 3 × 2², only the 2 is squared: 3 × 4 = 12, not 36.

## Nested brackets: inside out

Sometimes brackets sit inside other brackets. Start with the innermost pair and work outward, like peeling an onion.

### Worked example: nested brackets

Solve 2 × [3 + (4 − 1) × 2].

1. Innermost brackets: 4 − 1 = 3. The sum becomes 2 × [3 + 3 × 2].
2. Inside the square brackets, multiply before adding: 3 × 2 = 6. Now it is 2 × [3 + 6].
3. Finish the square brackets: 3 + 6 = 9. Now it is 2 × 9.
4. Multiply: 2 × 9 = 18.

The answer is 18. Treat each bracket layer as its own little sum, with the normal order running inside each one.

## PEMDAS vs BODMAS: same thing, different accent

You will see both words. They describe the exact same order:

| PEMDAS | BODMAS | Meaning |
|---|---|---|
| P : Parentheses | B : Brackets | ( ) first |
| E : Exponents | O : Orders | powers and roots |
| M/D | D/M | multiply and divide, left to right |
| A/S | A/S | add and subtract, left to right |

Different letters, same maths. Use whichever word your teacher uses. Just remember M and D are equals (and so are A and S), so within each pair you always go left to right.

## Where this actually matters

This is not only an exam rule. It is running quietly inside every machine that does maths for you:

- **Calculators.** A scientific calculator follows the order, so 3 + 4 × 5 gives 23. A very basic calculator just works left to right as you type, giving 35. Two calculators, two answers. Now you know why.
- **Spreadsheets.** Type `=2+3*4` and you get 14, because it multiplies first. Want the addition first? Write `=(2+3)*4`. The brackets are doing real work there.
- **Programming.** Every programming language uses this order. Learning it now is a head start on coding later.

## Quick questions

**Why not always go left to right?**

Because then 3 + 4 × 5 would be 35, and every textbook, calculator, and computer on the planet would disagree with you. One agreed order keeps everyone's answers identical.

**Do brackets really change anything?**

Hugely. Compare 10 − 2 × 3 = 4 with (10 − 2) × 3 = 24. The brackets drag the subtraction to the front and the answer comes out six times bigger.

**What if I am still unsure on a tricky one?**

Add brackets yourself. Writing (4 × 5) + 3 costs nothing and removes all doubt. Brackets are free. Use them.

## Worked example: powers and brackets together

Solve (2 + 3)² − 4 × 3.

1. Brackets first: 2 + 3 = 5. The sum becomes 5² − 4 × 3.
2. Power next: 5² = 25. Now it is 25 − 4 × 3.
3. Multiply before subtracting: 4 × 3 = 12. Now it is 25 − 12.
4. Subtract: 25 − 12 = 13.

The answer is 13.

My best tip for scary-looking sums: rewrite the whole line after each step, exactly as above. Each new line should have one fewer operation than the last. If a line looks identical to the one above it, you skipped a step. Go back.

## Try it yourself

1. Solve 8 + 12 ÷ 4.
2. Solve 2 × (5 − 1)².

**Answers:** 1) Divide first: 12 ÷ 4 = 3, then 8 + 3 = 11. 2) Brackets: 5 − 1 = 4, then 4² = 16, then 2 × 16 = 32.

You can check trickier sums with the [scientific calculator](/calculators/scientific), which follows this order automatically. When you are ready, try the [arithmetic quiz](/quizzes/arithmetic) or read about [working with negative numbers](/articles/negative-numbers).
