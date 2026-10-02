---
title: "Degrees vs Radians"
description: "Understand what degrees and radians measure, convert between them with π/180, and avoid the classic calculator-mode mistake."
topic: trigonometry
published: 2026-09-29
calculators: [scientific, unit-converter]
related: [pythagorean-theorem]
---

Here's a confession: radians confused me too, the first time I met them. Degrees felt natural. Radians felt like someone invented them just to make tests harder.

They didn't. Degrees and radians are just two different units for measuring the same angle, the way inches and centimeters are two units for the same length. The angle doesn't change. Only the number you describe it with does.

## Degrees: the ones you already know

In degrees, one full turn is split into 360 equal parts. Each part is 1°.

- A full turn is 360°.
- A half turn, a straight line, is 180°.
- A quarter turn, a square corner, is 90°.

Why 360? People picked it a very long time ago because it divides nicely by so many numbers: 2, 3, 4, 5, 6, 8, 9, 10, 12. Handy for splitting circles into neat pieces.

## Radians: measured with the circle itself

A radian is based on the circle, not on some ancient counting choice. Imagine a circle with radius r. Take a piece of string exactly as long as the radius and lay it along the edge of the circle. The angle at the center that this piece of string makes is **1 radian**.

Now, how many of those string-pieces fit around the whole circle? The distance around is 2πr, so 2π pieces of length r fit. That gives:

- A full turn is 2π radians, about 6.28.
- A half turn is π radians, about 3.14.
- A quarter turn is π/2 radians, about 1.57.

The one link worth memorizing:

**180° = π radians**

From this, 1 radian = 180 ÷ π ≈ 57.3°. So a radian is a big angle, more than fifty degrees. That surprises people.

## Converting degrees to radians

Multiply by π/180. That's the whole method.

### Example: convert 60° to radians

1. Multiply by π/180: 60 × π/180
2. Simplify the fraction: 60/180 = 1/3
3. So 60° = π/3 radians.
4. As a decimal, π/3 ≈ 1.0472

### Example: convert 45° to radians

1. 45 × π/180 = 45π/180
2. 45/180 simplifies to 1/4
3. So 45° = π/4 radians ≈ 0.7854

See the pattern? The π sticks around in the exact answer. That's normal and good. Exact beats decimal here.

## Converting radians to degrees

Multiply by 180/π. Just the flip of the other direction.

### Example: convert 3π/4 radians to degrees

1. Multiply by 180/π: 3π/4 × 180/π
2. The π on top and the π on the bottom cancel, leaving 3/4 × 180
3. 3/4 × 180 = 135
4. So 3π/4 radians = 135°.

### Example: convert 2 radians to degrees

1. 2 × 180/π = 360/π
2. 360 ÷ 3.14159… ≈ 114.59
3. So 2 radians ≈ 114.59°.

Radians don't always come with a π attached. 2 radians is a perfectly good angle, nothing missing.

## Common angles worth memorizing

| Degrees | Radians (exact) | Radians (decimal) |
|---|---|---|
| 0° | 0 | 0 |
| 30° | π/6 | ≈ 0.5236 |
| 45° | π/4 | ≈ 0.7854 |
| 60° | π/3 | ≈ 1.0472 |
| 90° | π/2 | ≈ 1.5708 |
| 180° | π | ≈ 3.1416 |
| 270° | 3π/2 | ≈ 4.7124 |
| 360° | 2π | ≈ 6.2832 |

You don't need all eight on day one. Start with 90°, 180°, and 360°.

## Why bother with radians at all?

Fair question. Here's the honest answer: radians make the formulas cleaner. The length of an arc of a circle is:

**arc length = radius × angle in radians**

A bicycle wheel has a radius of 30 cm. It turns through 2 radians. A point on the tire moves 30 × 2 = 60 cm along the edge. Done, no extra steps.

In degrees, that same formula needs an extra π/180 bolted on. Radians are also the standard unit in higher math and physics, so getting comfortable now saves you a headache later.

## The mistake I see every year

**Using the wrong calculator mode.** This is the big one, and I've watched it cost students marks on real tests.

In degree mode, sin(30) = 0.5. In radian mode, sin(30) means the sine of 30 *radians*, which is about −0.988. Same buttons, wildly different answer. Before every trigonometry question, glance at your calculator screen and check for DEG or RAD. Make it a habit, like checking your mirrors before driving.

The other classics:

- **Flipping the conversion.** Degrees to radians is × π/180. Radians to degrees is × 180/π. If your answer looks absurdly huge or tiny, you probably used the wrong one.
- **Rounding π too soon.** Keep answers like π/3 exact as long as you can. Round at the very end.
- **Thinking 1 radian is 1°.** One radian is about 57.3°. Much bigger than one degree.

## Where you'll actually meet radians

Radians feel abstract until you catch them working in the wild:

- **Wheels and spinning.** A car wheel, a Ferris wheel, a spinning record. Anything that rotates is measured naturally in radians. If a Ferris wheel with a radius of 12 m turns through π/2 radians, each cabin travels along an arc of 12 × π/2 = 6π ≈ 18.85 m.
- **Robots and games.** Robot arms and video game cameras rotate in radians under the hood, because the math stays simpler that way.
- **Physics.** Rotational speed is measured in radians per second. A wheel turning at 2 radians per second completes about 0.32 of a full turn each second, since one full turn is 2π ≈ 6.28 radians.

## Extra worked example: arc length

A question that ties everything together: find the arc length when a circle of radius 8 cm is swept by an angle of 120°.

1. The arc formula needs radians, so convert first: 120 × π/180 = 2π/3.
2. Arc length = radius × angle = 8 × 2π/3.
3. Multiply: 8 × 2π/3 = 16π/3.
4. As a decimal: 16π/3 ≈ 16.76 cm.

So the arc is 16π/3 cm long, about 16.76 cm.

## A handy way to think about it

When an angle looks strange, think of it as a fraction of a full turn.

- 1/4 turn = 90° = π/2 radians
- 1/3 turn = 120° = 2π/3 radians
- 1/2 turn = 180° = π radians
- 3/4 turn = 270° = 3π/2 radians

Check the pattern: multiply the fraction by 360 for degrees, or by 2π for radians. A 1/6 turn is 360 ÷ 6 = 60° and 2π/6 = π/3 radians. If you can picture the fraction of a turn, both units make sense.

## Mini FAQs

**Why not just use degrees for everything?**
You can, but the formulas get uglier. In degrees, arc length = radius × degrees × π/180. That extra π/180 is just converting to radians behind the scenes. Radians are the unit the formulas were built for.

**Do I write "radians" after the number?**
It helps. An answer of "1.05" could mean 1.05 radians or 1.05 degrees, and those are very different angles. Writing "1.05 radians" removes the doubt. Exact answers like π/3 are understood to be radians.

**Which mode should my calculator be in for homework?**
Match the question. If the angle is written with °, use degree mode. If it involves π or the word "radians", use radian mode. When you switch, say it out loud, "switching to radians", so you never forget to switch back.

## Keep going

Once conversions feel easy, try them inside real triangle problems with the [geometry quiz](/quizzes/geometry), and use the [scientific calculator](/calculators/scientific) to check sin, cos and tan values in both modes.

## Try it yourself

1. Convert 120° to radians.
2. Convert 5π/6 radians to degrees.

**Answers:** 1) 120 × π/180 = 2π/3 ≈ 2.0944. 2) 5/6 × 180 = 150°.

You can check conversions like these with the [unit converter](/calculators/unit-converter), and use the [scientific calculator](/calculators/scientific) to try sin, cos and tan in both modes. The [trigonometry lesson](/learn/trigonometry) builds on this, and the [Pythagorean theorem](/articles/pythagorean-theorem) is a good place to review right triangles first.
