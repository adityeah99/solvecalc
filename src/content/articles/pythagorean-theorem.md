---
title: "How the Pythagorean Theorem Works"
description: "Use a² + b² = c² to find a missing side of a right triangle, check whether a corner is square, and see why the rule works."
topic: geometry
published: 2026-09-29
calculators: [geometry, square-root]
quiz: geometry
related: [degrees-vs-radians]
---

The Pythagorean theorem is a rule about right triangles. A right triangle is a triangle with one square corner, a 90° angle, like the corner of a sheet of paper.

The rule links the three sides. If you know any two of them, you can find the third.

## The rule

**a² + b² = c²**

- a and b are the two shorter sides. They meet at the right angle and are called the **legs**.
- c is the longest side. It is opposite the right angle and is called the **hypotenuse**.

In words: if you square the two shorter sides and add them, you get the square of the longest side.

## Example: the classic 3-4-5 triangle

A right triangle has legs of 3 cm and 4 cm. How long is the hypotenuse?

1. Square the legs: 3² = 9 and 4² = 16
2. Add them: 9 + 16 = 25
3. So c² = 25
4. Take the square root: c = √25 = 5
5. The hypotenuse is 5 cm.

## Example: a shortcut across the park

A rectangular park is 80 m long and 60 m wide. You are at one corner and want to get to the opposite corner. How much shorter is it to walk straight across than to walk along the edges?

The diagonal path and two edges of the park make a right triangle.

1. The legs are 80 m and 60 m.
2. Square them: 80² = 6400 and 60² = 3600
3. Add: 6400 + 3600 = 10,000
4. Take the square root: √10,000 = 100
5. The diagonal is 100 m.

Walking along the edges is 80 + 60 = 140 m. So cutting across saves 140 − 100 = 40 m.

## Finding a shorter side

If you know the hypotenuse and one leg, you **subtract** instead of adding.

### Example: a ladder against a wall

A 6.5 m ladder leans against a wall. Its foot is 2.5 m away from the wall. How high up the wall does it reach?

The ladder is the hypotenuse, because it sits opposite the right angle between the wall and the ground.

1. Write the rule with the unknown height h: 2.5² + h² = 6.5²
2. Square the numbers you know: 6.25 + h² = 42.25
3. Subtract 6.25 from both sides: h² = 36
4. Take the square root: h = 6
5. The ladder reaches 6 m up the wall.

## When the answer is not a whole number

Most triangles do not give neat answers. If the legs are 5 and 7:

1. 5² + 7² = 25 + 49 = 74
2. c = √74 ≈ 8.60

That is fine. Use a calculator for the square root and round at the end.

## Checking for a right angle

The rule also works backwards. If a² + b² = c² for the three sides, the triangle has a right angle.

- Sides 6, 8, 10: 6² + 8² = 36 + 64 = 100, and 10² = 100. They match, so it is a right triangle.
- Sides 5, 6, 8: 5² + 6² = 25 + 36 = 61, but 8² = 64. Since 61 ≠ 64, it is not a right triangle.

This gives you a handy way to check that a corner is square, for example when marking out a patio with a tape measure.

## Why it works

Picture a square drawn on each side of a right triangle. The area of a square is its side length squared. So the theorem says the two smaller squares together have exactly the same area as the big square on the hypotenuse.

For the 3-4-5 triangle, the small squares have areas 9 and 16. Together that is 25, which is the area of the square on the side of length 5.

## Whole-number triangles

Some right triangles have whole-number sides. These sets are called Pythagorean triples.

| a | b | c |
|---|---|---|
| 3 | 4 | 5 |
| 5 | 12 | 13 |
| 8 | 15 | 17 |
| 7 | 24 | 25 |

Any multiple also works. Doubling 3-4-5 gives 6-8-10.

## Mistakes to watch for

- **Putting the hypotenuse in the wrong place.** c must be the longest side, opposite the right angle.
- **Adding when you should subtract.** To find a leg, take the smaller square away from the hypotenuse squared.
- **Forgetting the square root.** c² = 25 means c = 5, not 25.
- **Using it on the wrong triangle.** The rule only works for right triangles.

## Example: how big is a 55-inch TV?

TV sizes are measured diagonally, which hides how wide and tall the screen really is. A 55-inch TV with a 16:9 screen: how wide is it?

The width, height, and diagonal form a right triangle, so:

1. Find the diagonal of a 16-by-9 rectangle: 16² + 9² = 256 + 81 = 337.
2. Take the square root: √337 ≈ 18.36. So 18.36 ratio-units equal 55 inches.
3. One ratio-unit is 55 ÷ 18.36 ≈ 3.00 inches.
4. Width = 16 × 3.00 ≈ 48 inches. Height = 9 × 3.00 ≈ 27 inches.

Check: 48² + 27² = 2304 + 729 = 3033, and √3033 ≈ 55. Correct. So a "55-inch" TV is about 48 inches wide and 27 inches tall. You can use the same trick for any screen size.

## The distance formula is the same idea

On a grid or a map, the distance between two points is just the hypotenuse of a right triangle. The horizontal gap is one leg, the vertical gap is the other.

**Example.** How far is it from point (1, 2) to point (7, 10)?

1. Horizontal gap: 7 − 1 = 6.
2. Vertical gap: 10 − 2 = 8.
3. Distance² = 6² + 8² = 36 + 64 = 100.
4. Distance = √100 = 10.

So the two points are 10 units apart. Map apps use exactly this maths (in fancier form) to measure distances for you.

## Quick reference

| You know | You want | Do this |
|---|---|---|
| Both legs a and b | Hypotenuse c | c = √(a² + b²) |
| Hypotenuse c and leg a | Other leg b | b = √(c² − a²) |
| All three sides | Is it a right angle? | Check whether a² + b² = c² |
| Two points on a grid | Distance | d = √((x₂ − x₁)² + (y₂ − y₁)²) |

The second row is just the rule rearranged. If a² + b² = c², then b² = c² − a².

## Quick questions

**Does the theorem work for any triangle?**

No, only right triangles. If there is no 90° angle, the rule does not apply. For other triangles you need the law of cosines, which the [triangle solver](/calculators/triangle-solver) handles for you.

**What if I only know one side?**

That is not enough. Infinitely many right triangles share one side length, so you need at least two sides (or one side and an angle) to pin the triangle down.

**Why is it called a theorem and not a rule?**

A theorem is a statement that has been proved true, not just noticed to work. The Pythagorean theorem has hundreds of known proofs, from ancient Chinese diagrams to a proof by US president James Garfield.

## Try it yourself

1. A right triangle has legs of 9 cm and 12 cm. Find the hypotenuse.
2. A right triangle has a hypotenuse of 10 m and one leg of 6 m. Find the other leg.

**Answers:** 1) 81 + 144 = 225, and √225 = 15 cm. 2) 100 − 36 = 64, and √64 = 8 m.

Check these with the [geometry calculator](/calculators/geometry) or the [square root calculator](/calculators/square-root), then try the [geometry quiz](/quizzes/geometry). Right triangles lead on to trigonometry, where angles are often measured in radians. See [degrees vs radians](/articles/degrees-vs-radians) for more.
