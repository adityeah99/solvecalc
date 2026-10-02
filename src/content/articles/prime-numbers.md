---
title: "Prime Numbers Explained"
description: "Find out what makes a number prime, how to test whether a number is prime, and how to break any number into its prime factors."
topic: arithmetic
published: 2026-09-30
calculators: [gcd, lcm]
quiz: arithmetic
related: [factors-and-multiples, how-to-simplify-fractions]
---

A prime number is a whole number greater than 1 that has exactly two factors: 1 and itself. Primes are the building blocks of every other number, so they turn up all over maths.

The number 7 is prime because nothing divides into it evenly except 1 and 7. The number 8 is not, because 2 and 4 also divide into it.

## What counts as prime

For a number to be prime it must:

- Be a whole number bigger than 1.
- Have no factors other than 1 and itself.

The first few primes are 2, 3, 5, 7, 11, 13, 17, 19, and 23. Notice that 2 is the only even prime, because every other even number can be divided by 2.

### Numbers that are not prime

A whole number greater than 1 that is not prime is called **composite**. It has factors beyond 1 and itself. For example, 9 = 3 × 3 and 12 = 2 × 6, so both are composite.

The number 1 is a special case. It is neither prime nor composite, because it has only one factor: itself.

## How to test if a number is prime

Try dividing by the primes in order: 2, 3, 5, 7, and so on. You only need to test primes up to the square root of your number. If none divide in evenly, your number is prime.

### Worked example: is 51 prime?

1. Is it even? No, so 2 is not a factor.
2. Do the digits add to a multiple of 3? 5 + 1 = 6, which is a multiple of 3. So 3 is a factor.
3. Check: 51 ÷ 3 = 17.

Because 51 = 3 × 17, it has factors other than 1 and itself, so 51 is **not prime**.

### Worked example: is 29 prime?

The square root of 29 is about 5.4, so test the primes 2, 3, and 5.

1. 29 is odd, so 2 does not divide it.
2. 2 + 9 = 11, which is not a multiple of 3.
3. It does not end in 0 or 5, so 5 does not divide it.

Nothing divides in, so 29 **is prime**.

## Prime factorisation

Every composite number can be written as a product of primes in exactly one way. This is called its prime factorisation. A factor tree helps you find it.

### Worked example: prime factors of 60

1. 60 = 2 × 30
2. 30 = 2 × 15
3. 15 = 3 × 5

Collecting the primes: 60 = 2 × 2 × 3 × 5, which we write as 2² × 3 × 5.

You can check by multiplying back: 2 × 2 × 3 × 5 = 60.

Prime factors are useful for finding a greatest common factor or a lowest common multiple, and for simplifying fractions.

## Common mistakes

- **Calling 1 prime.** A prime needs exactly two different factors. The number 1 has only one, so it does not count.
- **Thinking all odd numbers are prime.** 9, 15, and 21 are all odd but composite.
- **Forgetting 2 is prime.** It is the only even prime, and it is easy to skip.
- **Stopping the factor tree too soon.** Keep going until every number at the end is prime.

## Prime vs composite: a quick comparison

It helps to see the three kinds of whole number side by side:

| Type | How many factors | Examples |
|---|---|---|
| Prime | Exactly 2 (1 and itself) | 2, 3, 5, 7, 11 |
| Composite | 3 or more | 4 (1, 2, 4), 8 (1, 2, 4, 8), 9 (1, 3, 9) |
| Neither | Exactly 1 | 1 |

The test is always the same: count the factors. Exactly two means prime. More than two means composite. The number 1 is in a group of its own.

### Worked example: prime factors of 96

Break 96 into primes with a factor tree:

1. 96 = 2 × 48
2. 48 = 2 × 24
3. 24 = 2 × 12
4. 12 = 2 × 6
5. 6 = 2 × 3

Collecting the primes: 96 = 2 × 2 × 2 × 2 × 2 × 3, which we write as 2⁵ × 3.

Check by multiplying back: 2⁵ = 32, and 32 × 3 = 96. Correct.

## Where primes show up in real life

Primes are not just a school topic. They quietly protect your everyday life:

- **Online security.** When you log in to your bank or buy something online, the encryption often uses two huge prime numbers multiplied together. Multiplying them is easy, but working backwards to find the two primes is so hard that it keeps your data safe. This is called RSA encryption.
- **Clocks and calendars.** Numbers like 60 (seconds in a minute) and 360 (degrees in a circle) are composite on purpose. Because 60 = 2² × 3 × 5, it splits neatly into halves, thirds, quarters, fifths, and sixths. A prime number of seconds would be far less handy.
- **Barcodes and checks.** Prime numbers help build the check digits that catch scanning mistakes on tickets and parcels.

So primes are useful for hiding secrets, and composites are useful for sharing things out fairly.

## Quick questions

**Are there infinitely many primes?**

Yes. The ancient Greek mathematician Euclid proved it about 2,300 years ago. His argument: whatever list of primes you have, multiply them all together and add 1. The result has a prime factor that is not on your list, so the list can never be complete.

**What is the largest known prime?**

It changes every few years as computers search further. The record holders have millions of digits and would fill a small book. You will never need to write one out, but knowing they keep going is the point.

**Is 2 really the only even prime?**

Yes. Every even number bigger than 2 can be divided by 2, so it has at least three factors: 1, 2, and itself. That leaves 2 alone as the odd one out among the evens.

## The sieve of Eratosthenes

There is a neat trick for finding all the primes up to any number. It is called the sieve of Eratosthenes, after the ancient Greek who invented it.

To find the primes up to 30:

1. Write out 2 to 30.
2. Circle 2, then cross out every multiple of 2 after it (4, 6, 8, …).
3. Circle 3, then cross out every multiple of 3 left standing (9, 15, 21, 27).
4. Circle 5, then cross out its multiples (25).
5. Circle 7. Its next multiple after 7 is 49, which is past 30, so you can stop.

Every circled number is prime: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Everything else got crossed out. You only need to sieve with primes up to the square root of your limit, which is why the work stops at 7 here (√30 ≈ 5.5, and the next prime after that is 7).

## Try it yourself

1. Is 91 prime?
2. Write 84 as a product of prime factors.

**Answers:** 1) 91 = 7 × 13, so it is not prime. 2) 84 = 2 × 42 = 2 × 2 × 21 = 2 × 2 × 3 × 7, which is 2² × 3 × 7.

To find shared factors quickly, try the [GCD calculator](/calculators/gcd) or the [LCM calculator](/calculators/lcm). Then test yourself with the [arithmetic quiz](/quizzes/arithmetic), or read about [factors and multiples](/articles/factors-and-multiples).
