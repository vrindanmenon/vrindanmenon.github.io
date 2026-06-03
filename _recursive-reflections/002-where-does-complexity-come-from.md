---
layout: blogpost
title: "002 — Where Does Complexity Come From?"
date: 2026-03-01
tags: [numbers, history, patterns]
---

I keep returning to the same question.

Where does complexity come from?

Not complexity in equations.  
Not symbolic complexity.

Complexity in the world.

The branching of a river delta.  
The spiral of a shell.  
The way a flock of starlings folds into itself and then opens again.

No one designs these things.  
No architect drafts a snowflake.  
No choreographer directs a starling or the fireflies.

And yet what appears is structured. Geometric. Sometimes so precise it feels intentional.

I used to assume complexity required design.

Now I’m not so sure.

---

## The Starlings

The first time I watched a murmuration carefully, something shifted.

Thousands of birds. No visible leader.

And yet the flock moves as if it shares a single nervous system.

I watched this clip again recently: <a href="https://www.youtube.com/watch?v=V4f_1_r80RY">Flight of the Starlings</a>


What rule could each bird be following?

Just one bird.

What information does it have?  
Only its nearest neighbors.  
Only local signals.

If that’s true, then the global shape isn’t designed.

It emerges.

That word keeps returning. Emerges! Does patterns always emerge?

---

## The Fireflies

Then I came across about synchronous fireflies in Southeast Asia — entire trees lighting up in perfect rhythm along mangrove rivers.

Each firefly has its own internal timing.

But when one flashes, nearby fireflies adjust slightly.

Tiny adjustments.

Over time, the whole system synchronizes.

No master clock.

Just interaction.

Maybe complexity isn’t planned. Maybe it emerges.

---

## When I Tried to Make Randomness

If complexity emerges from rules, what does pure randomness look like?

So I wrote the simplest thing I could:

```javascript
for (let i = 0; i < 10000; i++) {
  let x = random(width);
  let y = random(height);
  point(x, y);
}
```
I expected evenness.
Instead, I saw clusters.

Gaps.

But the more I read, the more I realized:

True randomness contains streaks.

We expect randomness to avoid patterns.

But mathematically, it doesn’t promise that.

It promises probability — not aesthetic fairness.

Something in my intuition broke there.

If randomness could look structured,
and structure could look random,

then maybe I didn’t yet understand either.


<div style="display:flex; justify-content:space-between; margin-top:40px;">

<div>
← <a href="/recursive-reflections/001-when-humans-began-to-count/">Previous</a>
</div>

<div>
<a href="/recursive-reflections/003-the-sin-of-arithmetic/">Next</a> →
</div>

</div>