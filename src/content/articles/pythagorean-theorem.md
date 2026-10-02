---
title: "How the Pythagorean Theorem Works"
description: "Use a² + b² = c² to find a missing side of a right triangle, check whether a corner is square, and see why the rule works."
topic: geometry
published: 2026-09-29
calculators: [geometry, square-root]
quiz: geometry
related: [degrees-vs-radians]
---

I used to mix up which side was c in this formula. Every time. Then a teacher told me: c is the loner. It sits alone, opposite the right angle, always the longest. I have never mixed it up since. If this theorem is new to you, start with that image.

The Pythagorean theorem is a rule about right triangles. A right triangle has one square corner, a 90° angle, exactly like the corner of a sheet of paper.

The rule links the three sides. Know any two and you can find the third. That is genuinely useful, as you are about to see.

## The rule

**a² + b² = c²**

- a and b are the two shorter sides. They meet at the right angle. Call them the **legs**.
- c is the longest side. It sits opposite the right angle. Call it the **hypotenuse**. The loner.

In words: square the two shorter sides, add them, and you get the square of the longest side.

## Example: the classic 3-4-5 triangle

A right triangle has legs of 3 cm and 4 cm. How long is the hypotenuse?

1. Square the legs: 3² = 9 and 4² = 16
2. Add them: 9 + 16 = 25
3. So c² = 25
4. Take the square root: c = √25 = 5
5. The hypotenuse is 5 cm.

You will meet 3-4-5 again and again. It is the most famous triangle in maths. Memorize it.

## Example: a shortcut across the park

A rectangular park is 80 m long and 60 m wide. You stand at one corner and want the opposite corner. How much shorter is the straight diagonal than walking the edges?

The diagonal plus two edges forms a right triangle.

1. The legs are 80 m and 60 m.
2. Square them: 80² = 6400 and 60² = 3600
3. Add: 6400 + 3600 = 10,000
4. Square root: √10,000 = 100
5. The diagonal is 100 m.

Walking the edges is 80 + 60 = 140 m. Cutting across saves 140 − 100 = 40 m. Nearly a third of the walk, gone.

## Finding a shorter side

Know the hypotenuse and one leg? Then you **subtract** instead of adding. Same rule, rearranged.

### Example: a ladder against a wall

A 6.5 m ladder leans against a wall, its foot 2.5 m out from the wall. How high does it reach?

The ladder is the hypotenuse. It sits opposite the right angle where wall meets ground.

1. Write the rule with height h unknown: 2.5² + h² = 6.5²
2. Square what you know: 6.25 + h² = 42.25
3. Subtract 6.25 from both sides: h² = 36
4. Square root: h = 6
5. The ladder reaches 6 m up the wall.

## When the answer is not a whole number

Most triangles are not as tidy as 3-4-5. Legs of 5 and 7:

1. 5² + 7² = 25 + 49 = 74
2. c = √74 ≈ 8.60

That is completely fine. Grab a calculator for the square root and round at the end, not in the middle.

## Checking for a right angle

The rule runs backwards too. If a² + b² = c² holds for three sides, the triangle has a right angle.

- Sides 6, 8, 10: 6² + 8² = 36 + 64 = 100, and 10² = 100. Match. Right triangle.
- Sides 5, 6, 8: 5² + 6² = 25 + 36 = 61, but 8² = 64. 61 ≠ 64. Not a right triangle.

Builders use this constantly. Marking out a patio? Measure 3-4-5 along the edges and your corner is square. No protractor needed.

## Why it works

Draw a square on each side of a right triangle. A square's area is its side length squared. So the theorem says something visual: the two smaller squares together cover exactly the same area as the big square on the hypotenuse.

For 3-4-5: the small squares have areas 9 and 16. Together that is 25, precisely the area of the square on the side of length 5. It is not a coincidence. It is geometry showing off.

## Whole-number triangles

Some right triangles have all whole-number sides. These sets have a name: Pythagorean triples.

| a | b | c |
|---|---|---|
| 3 | 4 | 5 |
| 5 | 12 | 13 |
| 8 | 15 | 17 |
| 7 | 24 | 25 |

Multiples work too. Double 3-4-5 and you get 6-8-10, still a perfect right triangle.

## Mistakes to watch for

- **Putting the hypotenuse in the wrong slot.** c is the longest side, opposite the right angle. Remember the loner.
- **Adding when you should subtract.** Finding a leg? Take the smaller square away from the hypotenuse squared.
- **Forgetting the final square root.** c² = 25 means c = 5, not 25. The squaring has to be undone.
- **Using it on the wrong triangle.** Right triangles only. No 90° angle, no theorem.

## Example: how big is a 55-inch TV?

TV sizes are measured diagonally, which hides the real width and height. A 55-inch TV with a 16:9 screen: how wide is it actually?

Width, height, and diagonal form a right triangle:

1. Diagonal of a 16-by-9 rectangle: 16² + 9² = 256 + 81 = 337.
2. Square root: √337 ≈ 18.36. So 18.36 ratio-units equal 55 inches.
3. One ratio-unit is 55 ÷ 18.36 ≈ 3.00 inches.
4. Width = 16 × 3.00 ≈ 48 inches. Height = 9 × 3.00 ≈ 27 inches.

Check: 48² + 27² = 2304 + 729 = 3033, and √3033 ≈ 55. Correct. So a "55-inch" TV is about 48 inches wide and 27 inches tall. Same trick works for any screen size, which is handy before you buy.

## The distance formula is the same idea

On a grid or a map, the distance between two points is just a hypotenuse in disguise. The horizontal gap is one leg, the vertical gap is the other.

**Example.** How far from point (1, 2) to point (7, 10)?

1. Horizontal gap: 7 − 1 = 6.
2. Vertical gap: 10 − 2 = 8.
3. Distance² = 6² + 8² = 36 + 64 = 100.
4. Distance = √100 = 10.

The points are 10 units apart. Map apps do exactly this maths (in fancier form) every time they measure a distance for you.

## Quick reference

| You know | You want | Do this |
|---|---|---|
| Both legs a and b | Hypotenuse c | c = √(a² + b²) |
| Hypotenuse c and leg a | Other leg b | b = √(c² − a²) |
| All three sides | Is it a right angle? | Check whether a² + b² = c² |
| Two points on a grid | Distance | d = √((x₂ − x₁)² + (y₂ − y₁)²) |

The second row is the rule rearranged. If a² + b² = c², then b² = c² − a². Same maths, different unknown.

## Quick questions

**Does the theorem work for any triangle?**

No. Right triangles only. Without a 90° angle the rule does not apply. Other triangles need the law of cosines, which the [triangle solver](/calculators/triangle-solver) handles for you.

**What if I only know one side?**

Not enough, sorry. Infinitely many right triangles share one side length. You need at least two sides, or one side and an angle, to pin the triangle down.

**Why "theorem" and not "rule"?**

A theorem is a statement proved true, not just observed to work. This one has hundreds of known proofs, from ancient Chinese diagrams to one by US president James Garfield. That is quite a fan club for a triangle fact.

## Try it yourself

1. A right triangle has legs of 9 cm and 12 cm. Find the hypotenuse.
2. A right triangle has a hypotenuse of 10 m and one leg of 6 m. Find the other leg.

**Answers:** 1) 81 + 144 = 225, and √225 = 15 cm. 2) 100 − 36 = 64, and √64 = 8 m.

Check these with the [geometry calculator](/calculators/geometry) or the [square root calculator](/calculators/square-root), then try the [geometry quiz](/quizzes/geometry). Right triangles lead naturally into trigonometry, where angles are often measured in radians. See [degrees vs radians](/articles/degrees-vs-radians) for more.
