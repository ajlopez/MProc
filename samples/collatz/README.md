# Collatz sample

A message processor that resolves the Collatz sequence 
(see [Collatz Problem](http://mathworld.wolfram.com/CollatzProblem.html).

It receives an array with a number to be processed, and at the end of the processing, it prints the Collatz sequence.
The processor receives 1000 one-item arrays, from [1] to [1000].

There are two versions: one that processes the message synchronously and other that use asynchronous calls.

To run:
```
node run
node runsync
```


