---
layout: blogpost
title: "003 — The Sin of Arithmetic"
date: 2026-03-02
tags: [randomness, history, patterns]
---

When I first saw clusters appear in a field of random dots, I assumed the flaw was mine.

I looked again.

The clusters were still there.

I hadn’t made a mistake.

The machine had made a confession.

---

Randomness, it turns out, is one of the hardest things to produce.

Not because it requires complexity.

Because it requires the complete absence of pattern.

To understand why computers struggle with this, you have to go back to a specific moment — and to a man who understood, better than almost anyone alive, exactly what he was about to attempt.

It is 1946. The war has ended. At the University of Pennsylvania, a machine called ENIAC fills an entire room. Thirty tonnes. Eighteen thousand vacuum tubes. It can perform five thousand additions per second — more than any human by a factor of thousands.

And it faces a task it was not built for.

A Polish mathematician, Stanisław Ulam, and John von Neumann are trying to understand how neutrons move through material — how they scatter, collide, slow down. The equations describing this process resist direct solution.

But there is another way.

Simulate it.

Send thousands of virtual neutrons on random paths. Track what happens. Average the results. The statistics will reveal what the equations cannot.

They name the approach the *Monte Carlo method* — after the casino, where everything runs on chance.

There is one problem.

To simulate randomness, you need randomness.

And ENIAC is a completely deterministic machine.

Give it the same input twice, you get the same output. Every time. Without exception. By design.

---

Von Neumann understood the contradiction immediately.

Arithmetic follows rules. It cannot surprise itself.

He said:

> “Anyone who considers arithmetical methods of producing random digits is, of course, in a state of sin.”

It sounds like a joke.

It isn’t — not quite.

---

His solution was the middle-square method.

Take a four-digit number. Call it the seed.

Square it. If necessary, pad the result to eight digits. Extract the four digits from the middle.

That becomes your next number.

Repeat.

Start with 5731:

5731² = 32,844,361 → middle four: 8443  
8443² = 71,285,249 → middle four: 2852  
2852² = 8,134,904 → middle four: 1349  
1349² = 1,819,801 → middle four: 8198  

The sequence looks random. The numbers jump without obvious pattern.

But the flaw is already present.

The seed completely determines the sequence.

There is no external input. No entropy. No genuine unpredictability.

It is a closed loop — a function iterating on itself.

And closed loops eventually cycle.

Some seeds collapse almost immediately.

The seed 0000 produces nothing but zeros.

The seed 5100 cycles after only a few steps.

The illusion of randomness breaks the moment the sequence repeats.

What appeared chaotic was always finite. Always contained. Always heading, eventually, back to somewhere it had already been.

---

At first, I wondered:

Is this just because of the decimal system we invented?

Because we chose base 10?

But the deeper answer has nothing to do with base.

The middle-square method takes a four-digit number and produces another four-digit number.

That means there are exactly 10,000 possible states:  
0000 through 9999.

No more.

Once you have taken 10,001 steps, you have used more steps than there are possible states.

By pure logic — not by any property of our number system — at least one state must have appeared twice.

And the moment a state repeats, everything that follows repeats.

The cycle is inevitable.

Mathematicians call this the *Pigeonhole Principle*.

If you have more pigeons than holes, at least one hole must contain two pigeons.

Here, the pigeons are steps in the sequence.

The holes are the possible four-digit numbers.

Finiteness guarantees repetition.

And repetition destroys the illusion.

The only question is how long it takes.

And that is the real sin.

Sooner or later, it must revisit the same pattern.

<div style="display:flex; justify-content:space-between; margin-top:40px;">

<div>
← <a href="/recursive-reflections/002-where-does-complexity-come-from/">Previous</a>
</div>

<div>
<a href="/recursive-reflections/004-path-to-pascals/">Next</a> →
</div>

</div>