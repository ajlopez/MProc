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
processor.use(function (message, context, next) { message++; next(null, message); })
    .use(function (message, context, next) { console.dir(message); })
```

Each message processor is a function that receives three parameters:
- `message`: A simple JavaScript object
- `context`: An auxiliary object with some utitility functions
- `next`: A function that receives two parameters `err`, `message`. It executes the next step 
in the message processor chain.

To send a message and processing it a synchronous way:

```js
processor.send(1);
```
Synchronous means that first step is inmediately executed and if it calls its next function, it is executed inmediately too.

To send a message and processing it an asynchronous way:
```js
processor.post(1);
```
Each step in the processor is not executed inmediately, but it will be executed in the next Node loop tick.

Note: each function in the chain can have asynchronous processing or not. The above discussion is about the
invocation of each step, not about their inner behavior.

Usually, each step/function in the message processor chain, calls the next function with the same message. But they
can enrich/transform the message, or give another message to the next function.

An step/function could send new messages to the processor, using the context:
```js
function numbers(messsage, context, next) {
    for (var k = 1; k < message.counter; k++)
        context.post({ counter: k });
}
```
`context.post` function processes the new message in asynchronous way. You can use `context.send` to send a message to
be synchronous processed.

See the Web Crawler sample for an example of using `context.post` to produce multiple message in one step.

See [Collatz sample](https://github.com/ajlopez/MProc/tree/master/samples/collatz) for an example using `context.post`, 
`context.send` to have a loop in the message process.

## Development

```
git clone git://github.com/ajlopez/MProc.git
cd MProc
npm install
npm test
```

## Samples

- [Collatz](https://github.com/ajlopez/MProc/tree/master/samples/collatz) Collatz problem sample.
- [Web Crawler](https://github.com/ajlopez/MProc/tree/master/samples/collatz) Simple Web Crawler.

## To do

- Named subprocessors, to send/post messages.
- Distributed samples.
- `context.clone` utility function to deep clone a message.

## Versions

- 0.0.1: Published, 2013-01-19, with `.createProcessor`, `processor.run`, `processor.runSync`, `context.send`, `context.post`.

## Contribution

Feel free to [file issues](https://github.com/ajlopez/MProc) and submit
[pull requests](https://github.com/ajlopez/MProc/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

