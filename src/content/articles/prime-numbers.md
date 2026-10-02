---
title: "Prime Numbers Explained"
description: "Find out what makes a number prime, how to test whether a number is prime, and how to break any number into its prime factors."
topic: arithmetic
published: 2026-09-30
calculators: [gcd, lcm]
quiz: arithmetic
related: [factors-and-multiples, how-to-simplify-fractions]
---

A student once asked me why we bother learning prime numbers when calculators exist. Fair question. Then I told him the same primes protect his bank login every time he taps "pay". He stopped asking.

A prime number is a whole number greater than 1 with exactly two factors: 1 and itself. Primes are the building blocks of every other number, which is why they keep turning up.

The number 7 is prime. Nothing divides into it evenly except 1 and 7. The number 8 is not, because 2 and 4 divide into it too.

## What counts as prime

Two conditions, both must hold:

- It is a whole number bigger than 1.
- Its only factors are 1 and itself.

The first few primes: 2, 3, 5, 7, 11, 13, 17, 19, 23. Spot the odd one out. 2 is the only even prime, because every other even number can be divided by 2. Students forget this constantly, so burn it in: 2 is prime.

### Numbers that are not prime

A whole number greater than 1 that is not prime is called **composite**. It has extra factors. 9 = 3 × 3 and 12 = 2 × 6, so both are composite.

And 1? Special case. It has only one factor (itself), so it is neither prime nor composite. It sits in a club of one.

## How to test if a number is prime

Try dividing by the primes in order: 2, 3, 5, 7, and so on. Here is the part that saves you hours: you only need to test primes up to the square root of your number. If none divide in evenly, your number is prime.

### Worked example: is 51 prime?

1. Even? No, so 2 is not a factor.
2. Digits add to a multiple of 3? 5 + 1 = 6, and 6 is a multiple of 3. So 3 is a factor.
3. Check: 51 ÷ 3 = 17.

Since 51 = 3 × 17, it has factors beyond 1 and itself. **Not prime.**

### Worked example: is 29 prime?

The square root of 29 is about 5.4, so test 2, 3, and 5 only.

1. 29 is odd, so 2 does not divide it.
2. 2 + 9 = 11, not a multiple of 3.
3. It does not end in 0 or 5, so 5 does not divide it.

Nothing divides in. 29 **is prime.**

## Prime factorisation

Every composite number breaks into primes in exactly one way. That unique breakdown is its prime factorisation. A factor tree finds it fast.

### Worked example: prime factors of 60

1. 60 = 2 × 30
2. 30 = 2 × 15
3. 15 = 3 × 5

Collect the primes: 60 = 2 × 2 × 3 × 5, written as 2² × 3 × 5.

Multiply back to check: 2 × 2 × 3 × 5 = 60. Good.

Prime factors are the secret behind greatest common factors, lowest common multiples, and simplifying fractions. Learn them once, use them everywhere.

## Common mistakes

- **Calling 1 prime.** A prime needs exactly two different factors. 1 has only one. It does not count, no matter how prime it looks.
- **Thinking all odd numbers are prime.** 9, 15, and 21 are odd and very much composite.
- **Forgetting 2 is prime.** The only even prime, and the easiest one to skip. Do not skip it.
- **Stopping the factor tree too soon.** Keep splitting until every number at the tips is prime. One composite left behind ruins the whole tree.

## Prime vs composite: side by side

Three kinds of whole number, one simple test:

| Type | How many factors | Examples |
|---|---|---|
| Prime | Exactly 2 (1 and itself) | 2, 3, 5, 7, 11 |
| Composite | 3 or more | 4 (1, 2, 4), 8 (1, 2, 4, 8), 9 (1, 3, 9) |
| Neither | Exactly 1 | 1 |

Count the factors. Exactly two means prime. More than two means composite. And 1 stays in its own group.

### Worked example: prime factors of 96

Break 96 down with a factor tree:

1. 96 = 2 × 48
2. 48 = 2 × 24
3. 24 = 2 × 12
4. 12 = 2 × 6
5. 6 = 2 × 3

Collect them: 96 = 2 × 2 × 2 × 2 × 2 × 3, written as 2⁵ × 3.

Check: 2⁵ = 32, and 32 × 3 = 96. Correct.

## Where primes show up in real life

Primes are not just a school topic. They are quietly running parts of your day:

- **Online security.** Logging into your bank or buying something online? The encryption often multiplies two huge primes together. Multiplying is easy. Working backwards to find the two primes is so hard that your data stays safe. This is RSA encryption, and it is primes all the way down.
- **Clocks and calendars.** 60 seconds in a minute, 360 degrees in a circle. These numbers are composite on purpose. Since 60 = 2² × 3 × 5, it splits neatly into halves, thirds, quarters, fifths, and sixths. A prime number of seconds would be far less handy.
- **Barcodes and checks.** Primes help build the check digits that catch scanning mistakes on tickets and parcels.

Primes hide secrets. Composites share things out fairly. Both earn their keep.

## Quick questions

**Are there infinitely many primes?**

Yes. The Greek mathematician Euclid proved it about 2,300 years ago with a beautiful argument: take any list of primes, multiply them all together, add 1. The result has a prime factor missing from your list. So no list is ever complete. Primes go on forever.

**What is the largest known prime?**

It changes every few years as computers search further. The record holders have millions of digits. You will never write one out, but the chase itself is the point.

**Is 2 really the only even prime?**

Yes. Every even number above 2 is divisible by 2, giving it at least three factors: 1, 2, and itself. That leaves 2 standing alone as the odd one out among the evens.

## The sieve of Eratosthenes

Want every prime up to some number? There is a 2,300-year-old trick for that, named after the Greek scholar Eratosthenes who invented it.

To find the primes up to 30:

1. Write out 2 to 30.
2. Circle 2, then cross out every multiple of 2 after it (4, 6, 8, and so on).
3. Circle 3, then cross out every multiple of 3 still standing (9, 15, 21, 27).
4. Circle 5, then cross out its multiples (25).
5. Circle 7. Its next multiple past 7 is 49, beyond 30, so stop here.

Every circled number is prime: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Everything else got crossed out. You only sieve with primes up to the square root of your limit, which is why the work ends at 7 (√30 ≈ 5.5, and 7 is the next prime up).

## Try it yourself

1. Is 91 prime?
2. Write 84 as a product of prime factors.

**Answers:** 1) 91 = 7 × 13, so it is not prime. Nice trap, that one. 2) 84 = 2 × 42 = 2 × 2 × 21 = 2 × 2 × 3 × 7, which is 2² × 3 × 7.

To find shared factors quickly, try the [GCD calculator](/calculators/gcd) or the [LCM calculator](/calculators/lcm). Then test yourself with the [arithmetic quiz](/quizzes/arithmetic), or read about [factors and multiples](/articles/factors-and-multiples).
