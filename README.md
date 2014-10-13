# MProc

Message processing middleware, for Node.js/JavaScript. It can chain message processors,
simple functions that receives a message (a simple JavaScript object).

## Installation

Via npm on Node:

```
npm install mproc
```

## Usage

Reference in your program:

```js
var mproc = require('mproc');
```

Create a message processor, and build a chain of message processors

```js
var processor = mproc.createProcessor();
processor.use(function (message, next) { message++; next(null, message); })
    .use(function (message, next) { console.dir(message); })
```

Each message processor is a function that receives two parameters:
- `message`: A simple JavaScript object
- `next`: A function that receives two parameters `err`, `message`. It executes the next step 
in the message processor chain.

You can define a processor with a `fail` error function:
```js
var processor = mproc.createProcessor()
    .use(function (msg, next) { ... })
    .use(function (msg, next) { ... })
    .fail(function (err) { ... })
```
The supplied fail function will be invoked if any `next` function call receives a non-null first argument, or if
the middleware function raise an exception.

To send a message to a processor:
```js
processor.run(message);
```

Note: each function in the chain can have asynchronous processing or not, then it can invoke the `next` or not.

Usually, each step/function in the message processor chain, calls the next function with the same message. But they
can enrich/transform the message, or give another message to the next function.

To give the same message (maybe enriched or transformed), you can call:
```js
next();
```
without arguments. If you want to send a NEW message to the next steps, use:
```js
next(null, newmessage);
```

Sometimes, you want to send new message to the same processor. In those cases, the step function can be defined with
a third parameter, the `context`, an auxiliary object with a function `post`:
```js
function numbers(messsage, next, context) {
    for (var k = 1; k < message.counter; k++)
        context.post({ counter: k });
}
```
`context.post` function processes the new message in the next tick.

See the Web Crawler sample for an example of using `context.post` to produce multiple message in one step.

See [Collatz sample](https://github.com/ajlopez/MProc/tree/master/samples/collatz) for an example using `context.post` to have a loop in the message process.

## Development

```
git clone git://github.com/ajlopez/MProc.git
cd MProc
npm install
npm test
```

## Samples

- [Collatz](https://github.com/ajlopez/MProc/tree/master/samples/collatz) Collatz problem sample.
- [Web Crawler](https://github.com/ajlopez/MProc/tree/master/samples/webcrawler) Simple Web Crawler.

## To do

- Named subprocessors, to send/post messages.
- Distributed samples.
- `context.clone` utility function to deep clone a message.

## Versions

- 0.0.1: Published, 2013-01-19, with `.createProcessor`, `processor.run`, `processor.runSync`, `context.send`, `context.post`.
- 0.0.2: Published. 2014-10-13. Removing `proc.runSync`, `context.send`. Adding `proc.fail`. Using `setImmediate`.

## Contribution

Feel free to [file issues](https://github.com/ajlopez/MProc) and submit
[pull requests](https://github.com/ajlopez/MProc/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

