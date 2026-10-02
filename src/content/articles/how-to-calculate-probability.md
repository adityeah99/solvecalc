---
title: "How to Calculate Probability"
description: "Work out the chance of an event using favorable and total outcomes, with dice, coins and marbles, including 'not', 'or' and 'and' questions."
topic: probability
published: 2026-09-29
calculators: [probability]
quiz: probability
related: [how-to-find-the-mean]
---

Probability is a way of measuring how likely something is to happen. It is always a number from 0 to 1.

- A probability of 0 means it cannot happen, like rolling a 7 on a normal die.
- A probability of 1 means it is certain, like rolling a number less than 7.
- Everything else is somewhere in between. A coin landing heads is 1/2, right in the middle.

## The basic formula

When every outcome is equally likely, the probability of an event is:

**P(event) = number of favorable outcomes ÷ total number of outcomes**

A **favorable outcome** is one that counts as what you are looking for. The **total outcomes** are all the things that could happen.

You can write the answer as a fraction, a decimal or a percentage. They all mean the same thing: 1/4 = 0.25 = 25%.

## Example: rolling a die

What is the probability of rolling a number greater than 4 on a normal six-sided die?

1. List all the outcomes: 1, 2, 3, 4, 5, 6. That is 6 outcomes.
2. List the favorable outcomes, the numbers greater than 4: 5 and 6. That is 2 outcomes.
3. Divide: 2 ÷ 6 = 2/6
4. Simplify: 2/6 = 1/3
5. The probability is 1/3, which is about 0.333 or 33.3%.

## Example: a bag of marbles

A bag holds 5 red marbles, 3 blue marbles and 2 green marbles. You pick one without looking. What is the probability it is blue?

1. Total marbles: 5 + 3 + 2 = 10
2. Blue marbles: 3
3. P(blue) = 3/10 = 0.3 = 30%

Each marble is equally likely to be picked, which is why we count marbles and not colors. There are three colors, but P(blue) is not 1/3, because there are more red marbles than blue ones.

## The probability of something NOT happening

The probability that an event happens and the probability that it does not happen always add up to 1. So:

**P(not A) = 1 − P(A)**

Using the same bag, what is the probability of **not** picking red?

1. P(red) = 5/10 = 1/2
2. P(not red) = 1 − 1/2 = 1/2

You can check by counting: the non-red marbles are 3 blue + 2 green = 5, and 5/10 = 1/2.

## "Or" questions

If two events cannot happen at the same time, add their probabilities.

What is the probability of picking red **or** green from the bag?

1. P(red) = 5/10 and P(green) = 2/10
2. A marble cannot be both, so add: 5/10 + 2/10 = 7/10

## "And" questions

If two events do not affect each other, multiply their probabilities. These are called **independent** events.

What is the probability of flipping heads on a coin **and** rolling a 6 on a die?

1. P(heads) = 1/2
2. P(6) = 1/6
3. Multiply: 1/2 × 1/6 = 1/12

### When the first pick changes the second

Now pick two marbles from the bag, one after the other, without putting the first one back. What is the probability that both are red?

1. First pick: 5 red out of 10, so 5/10
2. One red marble is gone. Second pick: 4 red out of 9, so 4/9
3. Multiply: 5/10 × 4/9 = 20/90
4. Simplify: 20/90 = 2/9, which is about 0.222

## Expected results vs real results

The probability of heads is 1/2, but if you flip a coin 20 times you will not always get exactly 10 heads. You might get 13. The **experimental probability** from that test would be 13/20 = 0.65.

If you do many more flips, the fraction of heads tends to get closer to 1/2. Probability tells you what to expect in the long run, not what will happen in one small test.

## Mistakes to watch for

- **Miscounting the outcomes.** Write them all out if you can. For two dice there are 6 × 6 = 36 outcomes, not 12.
- **Assuming outcomes are equally likely when they are not.** Red, blue and green are three colors, but they are not equally likely if the bag has different numbers of each.
- **Adding when you should multiply.** For "this and that", multiply. For "this or that" (when both cannot happen), add.
- **Thinking past results change the next one.** After five heads in a row, a fair coin still has a 1/2 chance of heads on the next flip.

## Probability in real life

You use probability thinking every day, even when you do not call it that.

- **Weather forecasts.** A "70% chance of rain" does not mean it will rain 70% of the day. It means that on days like this one, it rained about 7 times out of 10 in the past. So you grab an umbrella.
- **Games.** When you are one roll away from winning a board game and you need a 6, you know your chance is 1/6, about 17%. That tells you not to count on it.
- **Lotteries and raffles.** If 1,000 tickets are sold and you hold 5, your chance of winning is 5/1,000 = 1/200, or 0.5%. Seeing the tiny number helps you decide the ticket is just for fun.

## Quick reference: which rule to use

| The question sounds like | What to do | Example |
|---|---|---|
| "this **or** that" (cannot both happen) | Add the probabilities | P(red or green) = 5/10 + 2/10 = 7/10 |
| "this **and** that" (no effect on each other) | Multiply the probabilities | P(heads and a 6) = 1/2 × 1/6 = 1/12 |
| "**not** this" | Subtract from 1 | P(not red) = 1 − 5/10 = 5/10 |
| "this, **then** that" (first pick changes things) | Multiply, updating the counts | P(two reds, no replacement) = 5/10 × 4/9 = 2/9 |

When you are stuck, write the question out in words first: "Is this an 'and', an 'or', or a 'not'?" That one sentence usually tells you which rule to reach for.

## Quick questions

**Can a probability be bigger than 1?**

No. A probability of 1 means certain, and nothing can be more certain than certain. If your answer comes out bigger than 1, you made an arithmetic slip somewhere. Go back and check.

**What does a "50% chance of rain" really mean?**

It means that in similar weather conditions in the past, it rained about half the time. It does not mean it will rain for half the day, or that half of the area will get wet. Probability describes how often something happened before, not exactly what will happen today.

**Is a 1 in 1,000 chance the same as 0.1%?**

Yes. 1 ÷ 1,000 = 0.001, and 0.001 × 100 = 0.1%. Fractions, decimals and percentages are just three ways of writing the same probability, so convert to whichever form is easiest to compare.

## Try it yourself

1. A standard deck of 52 cards has 13 hearts. What is the probability of drawing a heart?
2. You flip two coins. What is the probability that both land heads?

**Answers:** 1) 13/52 = 1/4, or 25%. 2) 1/2 × 1/2 = 1/4, or 25%.

Check your answers with the [probability calculator](/calculators/probability), then try the [probability quiz](/quizzes/probability). The [probability lesson](/learn/probability) goes further. For a closely related skill from statistics, read [how to find the mean](/articles/how-to-find-the-mean).
