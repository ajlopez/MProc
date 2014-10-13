
var mproc = require('..');

exports['define and simple run'] = function (test) {
    test.async();
    var processor = mproc.createProcessor();

    processor.use(function (message, next) { message++; next(null, message); })    
        .use(function (message) { test.equal(2, message); test.done() });

    processor.run(1);
};

exports['define and simple run using the same message in next'] = function (test) {
    test.async();
    var processor = mproc.createProcessor();

    processor.use(function (message, next) { message.counter++; next(); })    
        .use(function (message) { test.ok(message); test.equal(2, message.counter); test.done() });

    processor.run({ counter: 1 });
};

exports['define and simple run with two steps'] = function (test) {
    test.async();

    var processor = mproc.createProcessor();

    function incmsg(message, next) { test.ok(message > 0); message++; next(null, message); }

    processor.use(incmsg)
        .use(incmsg)
        .use(function (message) { test.equal(3, message); test.done(); });

    processor.run(1);
};

exports['context post for loop'] = function (test) {
    test.async();

    var processor = mproc.createProcessor();

    function incmsg(message, next, context) { 
        test.ok(message > 0); 
        message++; 
        if (message == 3)
            next(null, message);
        else
            context.post(message);
    }

    processor.use(incmsg)    
        .use(function (message) { test.equal(3, message); test.done(); });

    processor.run(1);
};
