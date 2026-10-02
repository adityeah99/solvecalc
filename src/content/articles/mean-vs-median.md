---
title: "Mean vs Median: Which Average to Use"
description: "See how the mean and median are calculated, why they sometimes disagree, and how to pick the one that describes your data best."
topic: statistics
published: 2026-09-29
calculators: [statistics, average]
quiz: statistics
related: [how-to-find-the-mean]
---

The mean and the median are both types of average. Each one boils a set of numbers down to a single "typical" value. Most of the time they're close together. But sometimes they disagree wildly, and knowing why is one of the most useful things statistics teaches you.

## The 30-second version

- **Mean:** add up all the values, divide by how many there are.
- **Median:** put the values in order from smallest to largest, take the middle one.

That's the whole toolkit. Everything below is about when to reach for which.

## Example: an odd number of values

Five students scored these marks out of 10 on a spelling test: 7, 3, 9, 5, 6.

**Mean:**

1. Add: 7 + 3 + 9 + 5 + 6 = 30
2. Divide by 5: 30 ÷ 5 = 6

**Median:**

1. Put them in order: 3, 5, 6, 7, 9
2. The middle value is the 3rd one: 6

Both give 6. Nice when that happens. It won't always.

## Example: an even number of values

Six friends ran these distances in km during a week: 12, 4, 8, 10, 6, 14.

**Mean:**

1. Add: 12 + 4 + 8 + 10 + 6 + 14 = 54
2. Divide by 6: 54 ÷ 6 = 9

**Median:**

1. Put them in order: 4, 6, 8, 10, 12, 14
2. Six values, so there's no single middle. The two middle values are 8 and 10.
3. Take the mean of those two: (8 + 10) ÷ 2 = 9

Median is 9 km, same as the mean again. I can hear you asking: so when do they actually differ? Right now. Watch this.

## The example that changes minds

Five friends earn this much from weekend jobs: $20, $25, $22, $30 and $200. One of them landed a seriously well-paid gig.

**Mean:**

1. Add: 20 + 25 + 22 + 30 + 200 = 297
2. Divide by 5: 297 ÷ 5 = 59.40
3. The mean is $59.40.

**Median:**

1. Order: 20, 22, 25, 30, 200
2. Middle value: 25
3. The median is $25.

Now ask the real question: which number sounds like what a "typical" friend earns? Four of the five earn $30 or less. $25 describes the group. $59.40 describes... nobody, really. It's a fiction created by one big number.

That big number has a name: an **outlier**, a value far away from the rest. The mean uses every value, so an outlier drags it toward itself. The median only cares about the middle position, so the outlier barely moves it. This single idea explains half the misleading statistics you'll ever see in the news.

## Side by side

| | Mean | Median |
|---|---|---|
| How to find it | Add all values, divide by the count | Order the values, take the middle |
| Bothered by outliers | Yes, a lot | Barely |
| Good for | Data without extreme values, and finding totals | Data with outliers or a lopsided spread |
| Everyday examples | Test scores in a class, daily temperatures | House prices, earnings, times with one very slow result |

## So which one do I use?

Two questions. Answer them and you'll almost always pick right.

**Are there outliers, or is the data lopsided?** If a few values are much bigger or smaller than the rest, the median usually paints the fairer picture. This is why house prices and pay reports almost always quote the median. The mean would let a handful of mansions and millionaires rewrite the story.

**Do you care about the total?** The mean is tied to the total in a way the median isn't. Know the mean and the count, and you can get the total back. A team scoring a mean of 2 goals a game over 10 games scored 20 goals in all. The median can't tell you that.

No outliers and fairly even data? Both work, and the mean is the usual pick.

## Don't forget the mode

There's a third average people overlook: the **mode**, the value that shows up most often. In 3, 4, 4, 5, 9 the mode is 4. It shines where numbers aren't even the point, like the most popular shoe size or everyone's favorite color. You can't take a mean of favorite colors. Well, you could try. It wouldn't mean anything.

## Mistakes I see every year

- **Forgetting to sort.** The median of 7, 3, 9, 5, 6 is not 9 just because 9 sits in the middle as written. Order the values first. Every year, someone skips this.
- **Picking one of the two middle values.** With an even count, the median is the mean of the two middle values, not one of them.
- **Declaring one average "the best".** There is no best. Each tells you something different, and the data decides which one earns its keep.

## The house price example (memorize this one)

Five houses on one street sold for: $180,000, $195,000, $210,000, $225,000 and $950,000. The last one is a mansion. The rest are ordinary family homes.

**Mean:**

1. Add: 180,000 + 195,000 + 210,000 + 225,000 + 950,000 = 1,760,000
2. Divide by 5: 1,760,000 ÷ 5 = 352,000
3. The mean price is $352,000.

**Median:**

1. Already in order: 180,000, 195,000, 210,000, 225,000, 950,000
2. The middle value is $210,000.

The mean says $352,000, but four of the five houses sold for $225,000 or less. The mansion drags the mean up; the median of $210,000 describes a typical house on the street. This is exactly why property websites and news reports quote the **median** house price. Next time you see "median" in a headline, you'll know precisely why they chose it.

## Where each average lives in the wild

- **Median in the news.** "Median house price", "median pay", "median rent". Journalists reach for the median because a few very rich earners or luxury homes would make the mean lie.
- **Mean in sports.** A cricketer's batting average, a basketball player's points per game. Fans want total scoring power, outliers and all.
- **Mode in shops.** A shoe shop stocks more of the most popular size. That's the mode at work. The mean shoe size of its customers would be useless for ordering stock.
- **Mean in science.** An experiment repeated ten times reports the mean result, because averaging smooths out the small random errors in each attempt.

## The tricky case: when nobody is average

Six runners finished a fun run in these times in minutes: 30, 31, 29, 62, 60, 61. Three fast runners, three slow ones, nobody in between.

- Mean: (30 + 31 + 29 + 62 + 60 + 61) ÷ 6 = 273 ÷ 6 = 45.5
- Median: ordered, the two middle values are 31 and 60, so (31 + 60) ÷ 2 = 45.5

Both say 45.5 minutes. Nobody ran anything close to 45.5. When data splits into two clear groups, any single average misleads. The honest summary is "three runners around 30 minutes and three around 61", not one number. Averages describe the middle; they can't describe a split.

## Quick questions

**Can the mean and median differ a lot without one giant outlier?**

Yes. Any lopsided spread does it. Take town incomes of $25k, $28k, $30k, $32k, $35k, $38k, $120k. No single crazy value, but the steady upward stretch still pulls the mean above the median. Lopsided is lopsided, with or without a villain.

**Does the median have to be one of the values?**

With an odd count, yes, it's the middle value itself. With an even count, it lands halfway between the two middle values, which can fall between them, like 10.5.

**Which average should I use in a school project?**

Report both when you can, and explain the gap. "The mean is 59.4 and the median is 25, because one value of 200 pulls the mean up" shows far more understanding than silently picking one number. Teachers love this. Trust me.

## Try it yourself

1. Find the mean and median of 15, 3, 9, 21, 6, 12.
2. Find the mean and median of 2, 3, 3, 4, 48. Which is the better summary?

**Answers:** 1) Mean = 66 ÷ 6 = 11. In order: 3, 6, 9, 12, 15, 21, so median = (9 + 12) ÷ 2 = 10.5. 2) Mean = 60 ÷ 5 = 12, median = 3. The median is better, because 48 is an outlier.

Try your own lists in the [statistics calculator](/calculators/statistics) or the [average calculator](/calculators/average), then take the [statistics quiz](/quizzes/statistics). For more practice with the first step, see [how to find the mean](/articles/how-to-find-the-mean).
