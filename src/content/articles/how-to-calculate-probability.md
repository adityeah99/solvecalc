---
title: "How to Calculate Probability"
description: "Work out the chance of an event using favorable and total outcomes, with dice, coins and marbles, including 'not', 'or' and 'and' questions."
topic: probability
published: 2026-09-29
calculators: [probability]
quiz: probability
related: [how-to-find-the-mean]
---

Picture this. You're playing a board game with your family, one square from the finish line, and you need exactly a 6 to win. Everyone goes quiet. You shake the die. What are your chances, really?

That's probability. It's just a number that measures how likely something is, and it always sits somewhere from 0 to 1. Zero means it can't happen, like rolling a 7 on a normal die. One means it's certain, like rolling a number smaller than 7. A coin landing heads is 1/2, right in the middle.

## The one formula you need

When every outcome is equally likely, the probability of an event is:

**P(event) = number of favorable outcomes ÷ total number of outcomes**

Favorable outcomes are the ones you're hoping for. Total outcomes are everything that could happen. That's it. That's the whole game.

You can write the answer as a fraction, a decimal or a percentage. They all mean the same thing: 1/4 = 0.25 = 25%.

## Example: rolling a die

Back to that board game. What is the probability of rolling a number greater than 4 on a normal six-sided die?

1. List all the outcomes: 1, 2, 3, 4, 5, 6. That's 6 outcomes.
2. List the favorable outcomes, the numbers greater than 4: 5 and 6. That's 2 outcomes.
3. Divide: 2 ÷ 6 = 2/6
4. Simplify: 2/6 = 1/3
5. The probability is 1/3, which is about 0.333 or 33.3%.

So you had a one-in-three shot. Not great, not terrible.

## Example: a bag of marbles

A bag holds 5 red marbles, 3 blue marbles and 2 green marbles. You pick one without looking. What is the probability it is blue?

1. Total marbles: 5 + 3 + 2 = 10
2. Blue marbles: 3
3. P(blue) = 3/10 = 0.3 = 30%

Here's the trap I see every single year: "there are three colors, so it's 1/3, right?" No. You count marbles, not colors. There are more red marbles than blue ones, so red is more likely. The outcomes have to be equally likely before you can just count them, and colors aren't.

## The probability of something NOT happening

This one is a gift. The probability that something happens and the probability that it doesn't always add up to 1. So:

**P(not A) = 1 − P(A)**

Same bag. What is the probability of **not** picking red?

1. P(red) = 5/10 = 1/2
2. P(not red) = 1 − 1/2 = 1/2

Check by counting if you don't believe it: the non-red marbles are 3 blue + 2 green = 5, and 5/10 = 1/2. Same answer, less work. Whenever a question says "not", "at least one", or anything about the opposite of an event, reach for this first. It usually saves you a page of counting.

## "Or" questions: add them up

If two events cannot happen at the same time, add their probabilities.

What is the probability of picking red **or** green from the bag?

1. P(red) = 5/10 and P(green) = 2/10
2. A marble can't be both colors at once, so add: 5/10 + 2/10 = 7/10

The key phrase is "cannot happen at the same time". If they could overlap, adding would double-count the overlap.

## "And" questions: multiply

If two events don't affect each other, multiply their probabilities. These are called **independent** events.

What is the probability of flipping heads on a coin **and** rolling a 6 on a die?

1. P(heads) = 1/2
2. P(6) = 1/6
3. Multiply: 1/2 × 1/6 = 1/12

### When the first pick changes the second

Now pick two marbles from the bag, one after the other, without putting the first one back. What is the probability that both are red?

This is still an "and" question, so you still multiply. But the numbers change between picks, because the bag changes.

1. First pick: 5 red out of 10, so 5/10
2. One red marble is gone. Second pick: 4 red out of 9, so 4/9
3. Multiply: 5/10 × 4/9 = 20/90
4. Simplify: 20/90 = 2/9, which is about 0.222

The classic mistake here is using 5/10 twice. Always ask yourself: "did the first event change the setup for the second?" If yes, update your numbers.

## What probability promises (and what it doesn't)

The probability of heads is 1/2, but flip a coin 20 times and you won't always get exactly 10 heads. You might get 13. The **experimental probability** from that test would be 13/20 = 0.65.

Do many more flips and the fraction of heads drifts closer to 1/2. That's the deal probability makes with you: it tells you what to expect in the long run, not what happens in one small test. Weird streaks happen. The math only promises fairness over hundreds of flips, not the next ten.

## Mistakes I see every year

- **Miscounting the outcomes.** Write them all out when you can. For two dice there are 6 × 6 = 36 outcomes, not 12. Listing beats guessing.
- **Assuming outcomes are equally likely when they aren't.** Three colors in a bag doesn't mean 1/3 each. Count the actual items.
- **Adding when you should multiply.** "This and that" means multiply. "This or that" (with no overlap) means add. Say the question out loud if you're unsure.
- **Thinking past results change the next one.** Five heads in a row, and a fair coin still gives heads a 1/2 chance next flip. The coin has no memory.

## Probability in real life

You already think in probabilities all day. You just don't call it that.

- **Weather forecasts.** A "70% chance of rain" doesn't mean it rains 70% of the day. It means that on days like this one, it rained about 7 times out of 10 in the past. So you grab an umbrella. Sensible.
- **Games.** One roll from winning, need a 6, chance is 1/6, about 17%. That number tells you not to count on it. Manage your expectations.
- **Lotteries and raffles.** 1,000 tickets sold and you hold 5? Your chance is 5/1,000 = 1/200, or 0.5%. Seeing how tiny that number is helps you treat the ticket as fun, not a plan.

## Quick reference: which rule to use

| The question sounds like | What to do | Example |
|---|---|---|
| "this **or** that" (can't both happen) | Add the probabilities | P(red or green) = 5/10 + 2/10 = 7/10 |
| "this **and** that" (no effect on each other) | Multiply the probabilities | P(heads and a 6) = 1/2 × 1/6 = 1/12 |
| "**not** this" | Subtract from 1 | P(not red) = 1 − 5/10 = 5/10 |
| "this, **then** that" (first pick changes things) | Multiply, updating the counts | P(two reds, no replacement) = 5/10 × 4/9 = 2/9 |

Stuck on a question? Write it out in words first: "Is this an 'and', an 'or', or a 'not'?" That one sentence usually tells you exactly which rule to reach for.

## Quick questions

**Can a probability be bigger than 1?**

No. A probability of 1 means certain, and nothing beats certain. If your answer comes out bigger than 1, something slipped in the arithmetic. Go back and check.

**What does a "50% chance of rain" really mean?**

It means that in similar weather conditions in the past, it rained about half the time. Not half the day, not half the area. Probability describes how often something happened before, not exactly what happens today.

**Is a 1 in 1,000 chance the same as 0.1%?**

Yes. 1 ÷ 1,000 = 0.001, and 0.001 × 100 = 0.1%. Fractions, decimals and percentages are just three costumes for the same number, so convert to whichever is easiest to compare.

## Try it yourself

1. A standard deck of 52 cards has 13 hearts. What is the probability of drawing a heart?
2. You flip two coins. What is the probability that both land heads?

**Answers:** 1) 13/52 = 1/4, or 25%. 2) 1/2 × 1/2 = 1/4, or 25%.

Check your answers with the [probability calculator](/calculators/probability), then try the [probability quiz](/quizzes/probability). The [probability lesson](/learn/probability) goes further. For a closely related skill from statistics, read [how to find the mean](/articles/how-to-find-the-mean).
