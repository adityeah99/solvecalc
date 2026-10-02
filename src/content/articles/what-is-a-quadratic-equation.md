---
title: "What Is a Quadratic Equation?"
description: "Learn what a quadratic equation is, why it can have two answers, and how to solve one using square roots, factoring or the quadratic formula."
topic: algebra
published: 2026-09-29
calculators: [quadratic, square-root]
quiz: algebra
related: [what-is-a-linear-equation]
---

A quadratic equation is one where the highest power of the variable is 2. There's an x² in it, like x² − 5x + 6 = 0, but no x³ or anything higher.

That little squared term changes everything. A linear equation gives you one answer. A quadratic can give you two. This is the article where algebra starts getting interesting.

## The standard form

Every quadratic can be written like this:

**ax² + bx + c = 0**

Here a, b and c are numbers, and a can't be 0. If a were 0, the x² would vanish and you'd be back to a linear equation.

Some examples:

- x² − 5x + 6 = 0, where a = 1, b = −5, c = 6
- 2x² + 3x − 2 = 0, where a = 2, b = 3, c = −2
- x² − 49 = 0, where a = 1, b = 0, c = −49

## Why two answers?

Think about x² = 49. What squares to 49? 7 works: 7 × 7 = 49. But −7 works too: −7 × −7 = 49. Two answers from one equation. That's the whole game.

There's a picture behind it. Graph y = ax² + bx + c and you get a U-shaped curve called a **parabola**. The solutions are where the curve crosses the x-axis. A U shape can cross that line twice, touch it once, or miss it entirely. So a quadratic has two, one, or no real solutions. Once you see the curve, the "two answers" thing stops feeling weird.

## Method 1: Square roots

Use this when there's no x term, just x² and a number. For x² − 49 = 0, add 49 to both sides: x² = 49. Take the square root and keep both signs: x = 7 or x = −7. Done. Shortest method in the book, but only works for this shape.

## Method 2: Factoring

Factoring means rewriting the quadratic as two brackets multiplied together. It's the fastest route when the numbers are friendly.

### Example: x² − 5x + 6 = 0

1. Find two numbers that **multiply** to 6 (the c value) and **add** to −5 (the b value).
2. −2 and −3 work: −2 × −3 = 6 and −2 + −3 = −5.
3. Write the brackets: (x − 2)(x − 3) = 0
4. If two things multiply to 0, one of them is 0. So x − 2 = 0 or x − 3 = 0.
5. The solutions are x = 2 and x = 3.

**Check x = 2:** 2² − 5 × 2 + 6 = 4 − 10 + 6 = 0. Correct. I make my students check at least one root every time. It takes five seconds.

## Method 3: The quadratic formula

When factoring gets ugly, this always works. Memorize it:

**x = (−b ± √(b² − 4ac)) ÷ 2a**

The ± just means you run the calculation twice, once with + and once with −.

### Example: 2x² + 3x − 2 = 0

1. Read off a = 2, b = 3, c = −2.
2. Work out the bit under the root: b² − 4ac = 3² − 4 × 2 × (−2) = 9 + 16 = 25
3. Square root: √25 = 5
4. With +: x = (−3 + 5) ÷ 4 = 2 ÷ 4 = 1/2
5. With −: x = (−3 − 5) ÷ 4 = −8 ÷ 4 = −2
6. The solutions are x = 1/2 and x = −2.

### The discriminant

The bit under the root, b² − 4ac, has its own name: the **discriminant**. It tells you the answer count before you finish:

- **Positive:** two solutions (like the 25 above)
- **Zero:** one solution. For x² − 6x + 9 = 0, it's 36 − 36 = 0, and the only answer is x = 3.
- **Negative:** no real solutions. For x² + 2x + 5 = 0, it's 4 − 20 = −16, and negative numbers have no ordinary square root.

Think of it as a weather forecast for your equation. Check it first and you'll never be surprised.

## A real one: the garden problem

A rectangular garden is 3 metres longer than it is wide, and its area is 40 m². How wide is it?

1. Call the width w. The length is w + 3.
2. Area is width × length: w(w + 3) = 40
3. Multiply out and move everything to one side: w² + 3w − 40 = 0
4. Find two numbers that multiply to −40 and add to 3: 8 and −5.
5. Factor: (w + 8)(w − 5) = 0, so w = −8 or w = 5.
6. A width can't be negative, so the garden is 5 m wide and 8 m long. Check: 5 × 8 = 40.

Notice step 6. The maths gives you two answers, but reality throws one out. This happens a lot with quadratics in word problems. Always ask: does this answer make sense?

## The mistakes I see every year

- **Forgetting the negative root.** x² = 49 has two answers, 7 and −7. Students write 7 and stop. Every year.
- **Factoring before setting the equation to 0.** w² + 3w = 40 has to become w² + 3w − 40 = 0 first. The methods only work when one side is zero.
- **Losing a minus sign.** If b = −5, then −b = 5, and b² = 25, not −25. Squaring always kills the negative. Write it out if you're unsure.

## Factoring or the formula: which one?

Same answers either way, so pick by the numbers:

- **Factor** when the numbers are small and friendly. If a = 1 and c has few factors (6, 10, 12), factoring is usually fastest.
- **Formula** when factoring looks messy. Big numbers, fractions, or you tried the factor pairs and nothing works. The formula never fails.
- **Square roots** when there's no x term (x² = 49 style). Shortest path, no contest.

My rule of thumb for students: glance at the equation for five seconds. If a factor pair jumps out, factor. If not, go straight to the formula. Don't burn ten minutes hunting for factors that aren't there.

| Situation | Best method |
|---|---|
| x² = 81 (no x term) | Square roots |
| x² − 5x + 6 = 0 (small friendly numbers) | Factoring |
| 3x² + 7x − 11 = 0 (messy numbers) | Quadratic formula |
| Any quadratic at all | Quadratic formula (always works) |

## Worked example: x² + 5x + 6 = 0

1. Find two numbers that multiply to 6 and add to 5. Positive 2 and 3: 2 × 3 = 6 and 2 + 3 = 5.
2. Write the brackets: (x + 2)(x + 3) = 0.
3. Set each bracket to zero: x + 2 = 0 or x + 3 = 0.
4. The solutions are x = −2 and x = −3.

**Check x = −3:** (−3)² + 5 × (−3) + 6 = 9 − 15 + 6 = 0. Correct.

## Two quick questions

**Can a quadratic have no solution at all?**
Yes, over ordinary numbers. x² + 1 = 0 would need a number whose square is −1, and no real number does that. The discriminant (b² − 4ac) comes out negative, which is your warning sign.

**Why does the formula have a ± in it?**
Because the square root step gives two answers. Solving x² = 49 gives +7 and −7, and the ± is just shorthand for running the final division twice, once adding the root and once subtracting it.

**Do I have to simplify the root in the formula?**
Yes, if you can. If b² − 4ac = 50, write it as √(25 × 2) = 5√2 before dividing by 2a. A simplified root gives a tidier exact answer, and it's often where the marks are.

## Try it yourself

1. Solve x² − 7x + 10 = 0.
2. Solve x² = 81.

**Answers:** 1) (x − 2)(x − 5) = 0, so x = 2 or x = 5. 2) x = 9 or x = −9.

Check your answers with the [quadratic equation solver](/calculators/quadratic), and use the [square root calculator](/calculators/square-root) for messier roots. Then try the [algebra quiz](/quizzes/algebra), or go back to [what a linear equation is](/articles/what-is-a-linear-equation) to compare the two.
