---
title: "What Is a Quadratic Equation?"
description: "Learn what a quadratic equation is, why it can have two answers, and how to solve one using square roots, factoring or the quadratic formula."
topic: algebra
published: 2026-09-29
calculators: [quadratic, square-root]
quiz: algebra
related: [what-is-a-linear-equation]
---

A quadratic equation is an equation where the highest power of the variable is 2. It has an x² in it, like x² − 5x + 6 = 0, but no x³ or higher.

That squared term makes a big difference. A linear equation has one answer, but a quadratic can have two.

## The standard form

Every quadratic equation can be written like this:

**ax² + bx + c = 0**

Here a, b and c are numbers, and a cannot be 0. If a were 0, the x² would disappear and you would be left with a linear equation.

Some examples:

- x² − 5x + 6 = 0, where a = 1, b = −5, c = 6
- 2x² + 3x − 2 = 0, where a = 2, b = 3, c = −2
- x² − 49 = 0, where a = 1, b = 0, c = −49

## Why there can be two answers

Think about x² = 49. Which numbers, when squared, give 49? 7 works, because 7 × 7 = 49. But −7 also works, because −7 × −7 = 49 as well.

If you draw y = ax² + bx + c as a graph, you get a U-shaped curve called a **parabola**. The solutions are the points where the curve crosses the x-axis. A U shape can cross that line twice, touch it once, or miss it completely. So a quadratic can have two, one or no real solutions.

## Method 1: Square roots

This works when there is no x term, just x² and a number. For x² − 49 = 0, add 49 to both sides to get x² = 49. Then take the square root, keeping both signs: x = 7 or x = −7.

## Method 2: Factoring

Factoring means writing the quadratic as two brackets multiplied together. It works well when the numbers are friendly.

### Example: x² − 5x + 6 = 0

1. Look for two numbers that **multiply** to 6 (the c value) and **add** to −5 (the b value).
2. −2 and −3 work: −2 × −3 = 6 and −2 + −3 = −5.
3. Write the brackets: (x − 2)(x − 3) = 0
4. If two things multiply to make 0, one of them must be 0. So x − 2 = 0 or x − 3 = 0.
5. The solutions are x = 2 and x = 3.

**Check x = 2:** 2² − 5 × 2 + 6 = 4 − 10 + 6 = 0. Correct.

## Method 3: The quadratic formula

When factoring is hard, the quadratic formula always works:

**x = (−b ± √(b² − 4ac)) ÷ 2a**

The ± means you do the calculation twice, once with + and once with −.

### Example: 2x² + 3x − 2 = 0

1. Read off a = 2, b = 3, c = −2.
2. Work out the part under the root: b² − 4ac = 3² − 4 × 2 × (−2) = 9 + 16 = 25
3. Take the square root: √25 = 5
4. Using +: x = (−3 + 5) ÷ 4 = 2 ÷ 4 = 1/2
5. Using −: x = (−3 − 5) ÷ 4 = −8 ÷ 4 = −2
6. The solutions are x = 1/2 and x = −2.

### The discriminant

The part under the root, b² − 4ac, is called the **discriminant**. It tells you how many real solutions there are:

- **Positive:** two solutions (like 25 above)
- **Zero:** one solution. For x² − 6x + 9 = 0, it is 36 − 36 = 0, and the only answer is x = 3.
- **Negative:** no real solutions. For x² + 2x + 5 = 0, it is 4 − 20 = −16, and a negative number has no ordinary square root.

## A real-life example

A rectangular garden is 3 meters longer than it is wide, and its area is 40 m². How wide is it?

1. Let the width be w. The length is w + 3.
2. Area is width × length: w(w + 3) = 40
3. Multiply out and move everything to one side: w² + 3w − 40 = 0
4. Find two numbers that multiply to −40 and add to 3: 8 and −5.
5. Factor: (w + 8)(w − 5) = 0, so w = −8 or w = 5.
6. A width cannot be negative, so the garden is 5 m wide and 8 m long. Check: 5 × 8 = 40.

## Mistakes to watch for

- **Forgetting the negative root.** x² = 49 has two answers, 7 and −7.
- **Not setting the equation to 0 first.** w² + 3w = 40 must become w² + 3w − 40 = 0 before you factor or use the formula.
- **Losing a minus sign.** If b = −5, then −b = 5, and b² = 25, not −25.

## Factoring or the formula: which should you use?

Both methods give the same answers, so pick based on the numbers:

- **Use factoring** when the numbers are small and friendly. If a = 1 and c has few factors (like 6, 10 or 12), factoring is usually the fastest route.
- **Use the quadratic formula** when factoring looks messy — big numbers, fractions, or when you try the factor pairs and none work. The formula never fails.
- **Use square roots** when there is no x term at all (x² = 49 style). It is the shortest path.

A good habit: glance at the equation for five seconds. If a factor pair jumps out at you, factor. If not, go straight to the formula instead of burning time hunting.

| Situation | Best method |
|---|---|
| x² = 81 (no x term) | Square roots |
| x² − 5x + 6 = 0 (small friendly numbers) | Factoring |
| 3x² + 7x − 11 = 0 (messy numbers) | Quadratic formula |
| Any quadratic at all | Quadratic formula (always works) |

## Worked example: x² + 5x + 6 = 0

1. Find two numbers that multiply to 6 and add to 5. Positive 2 and 3 work: 2 × 3 = 6 and 2 + 3 = 5.
2. Write the brackets: (x + 2)(x + 3) = 0.
3. Set each bracket to zero: x + 2 = 0 or x + 3 = 0.
4. The solutions are x = −2 and x = −3.

**Check x = −3:** (−3)² + 5 × (−3) + 6 = 9 − 15 + 6 = 0. Correct.

## Two quick questions

**Can a quadratic have no solution at all?**
Yes, over ordinary numbers. x² + 1 = 0 would need a number whose square is −1, and no real number does that. The discriminant (b² − 4ac) is negative in this case, which is the warning sign.

**Why does the formula have a ± in it?**
Because the square root step produces two answers. When you solve x² = 49 you get +7 and −7, and the ± is just shorthand for doing the final division twice — once adding the root, once subtracting it.

**Do I have to simplify the root in the formula?**
Yes, if you can. If b² − 4ac = 50, write it as √(25 × 2) = 5√2 before dividing by 2a. A simplified root gives a tidier exact answer, and it is often what the marks are for.

## Try it yourself

1. Solve x² − 7x + 10 = 0.
2. Solve x² = 81.

**Answers:** 1) (x − 2)(x − 5) = 0, so x = 2 or x = 5. 2) x = 9 or x = −9.

Check your answers with the [quadratic equation solver](/calculators/quadratic), and use the [square root calculator](/calculators/square-root) for messier roots. Then try the [algebra quiz](/quizzes/algebra), or go back to [what a linear equation is](/articles/what-is-a-linear-equation) to compare the two.
