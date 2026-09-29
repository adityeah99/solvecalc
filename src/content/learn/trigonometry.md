---
title: "Trigonometry Basics"
description: "Learn how sine, cosine and tangent link the sides and angles of a right triangle, plus degrees, radians and finding angles with inverse trig."
topic: trigonometry
order: 6
calculators: [scientific, geometry]
articles: [degrees-vs-radians, pythagorean-theorem]
---

Trigonometry, or "trig" for short, is about the link between the angles and the sides of triangles. It lets you work out heights and distances you can't easily measure, like the height of a tree or how far up a wall a ladder reaches.

Everything in this lesson uses **right triangles**, so that's where we'll start.

## Right triangles and their sides

A right triangle has one angle of exactly 90°, a square corner. The side opposite that square corner is always the longest side. It's called the **hypotenuse**.

To name the other two sides, first pick one of the other two angles to focus on. We often call this angle θ, a Greek letter said "theta". Then:

- The **opposite** side is across from θ. It doesn't touch θ at all.
- The **adjacent** side is next to θ. It touches θ but isn't the hypotenuse.
- The **hypotenuse** is the long side, as always.

Which side is "opposite" and which is "adjacent" depends on the angle you picked. The hypotenuse never changes.

## SOH CAH TOA

The three main trig functions are **sine** (sin), **cosine** (cos) and **tangent** (tan). Each one is a ratio of two sides. The made-up word SOH CAH TOA helps you remember them:

- **SOH:** sin θ = Opposite ÷ Hypotenuse
- **CAH:** cos θ = Adjacent ÷ Hypotenuse
- **TOA:** tan θ = Opposite ÷ Adjacent

For a given angle, these ratios stay the same no matter how big or small the triangle is. That's why they're so useful.

**Worked example:** A 10 m ladder leans against a wall. It makes an angle of 60° with the ground. How high up the wall does it reach?

1. **Label the sides.** The ladder is the hypotenuse, 10 m. The height up the wall is opposite the 60° angle, and that's the side we want.
2. **Choose the ratio.** We know the hypotenuse and want the opposite, so use SOH: sin θ = opposite ÷ hypotenuse.
3. **Fill in the numbers.** sin 60° = height ÷ 10.
4. **Rearrange.** Multiply both sides by 10: height = 10 × sin 60°.
5. **Work it out.** sin 60° ≈ 0.866, so the height ≈ 10 × 0.866 = **8.66 m**.

So the ladder reaches about 8.66 m up the wall.

## Degrees and radians

There are two common ways to measure angles. You already know **degrees**, where a full turn is 360°.

The other way is **radians**. A full turn is 2π radians, which is about 6.28. So:

- 360° = 2π radians
- 180° = π radians
- 90° = π/2 radians, about 1.571

To change degrees into radians, multiply by π and divide by 180. For example, 60° = 60 × π ÷ 180 = π/3, which is about **1.047 radians**.

This matters when you use a calculator, because most have a degree mode and a radian mode. In degree mode, sin 30 gives 0.5. In radian mode, the calculator reads it as 30 radians and gives about −0.988. If you get a strange answer, check the mode first.

## Finding an angle with inverse trig

So far we've used an angle to find a side. But what if you know two sides and want the angle? That's what **inverse trig** is for.

The inverse functions are written sin⁻¹, cos⁻¹ and tan⁻¹. They work backwards: you give them a ratio, and they give you back the angle. On some calculators they're labeled asin, acos and atan.

**Example:** A ramp rises 3 m over a flat distance of 4 m. What angle does it make with the ground?

1. The rise (3 m) is opposite the angle. The flat distance (4 m) is adjacent to it.
2. Opposite and adjacent means TOA: tan θ = 3 ÷ 4 = 0.75.
3. Use inverse tan: θ = tan⁻¹(0.75) ≈ **36.87°**.

You can check this another way. By the Pythagorean theorem, the sloping side of the ramp is √(3² + 4²) = √25 = 5 m. Then sin θ = 3 ÷ 5 = 0.6, and sin⁻¹(0.6) ≈ 36.87° as well. Both routes give the same angle.

## Where to go next

Trig and the Pythagorean theorem go hand in hand, so it's worth reading [the Pythagorean theorem](/articles/pythagorean-theorem) if you haven't already. To get comfortable switching angle units, read [degrees vs radians](/articles/degrees-vs-radians). The [scientific calculator](/calculators/scientific) has sin, cos, tan and their inverses, and the [geometry calculator](/calculators/geometry) helps with the triangle side lengths. To practice right triangles and Pythagoras, try the [geometry quiz](/quizzes/geometry).
