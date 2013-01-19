
var mproc = require('..');

exports['createProcessor defined'] = function (test) {
    test.ok(mproc.createProcessor);
    test.equal(typeof mproc.createProcessor, 'function');
    test.done();
};

exports['define and sync simple run'] = function (test) {
    var processor = mproc.createProcessor();

    processor.use(function (message, context, next) { message++; next(null, message); })
        .use(function (message) { test.equal(2, message); test.done() });

    processor.runSync(1);
};

exports['define and sync simple run with two steps'] = function (test) {
    var processor = mproc.createProcessor();

    function incmsg(message, context, next) { message++; next(null, message); }

    processor.use(incmsg)
        .use(incmsg)
        .use(function (message) { test.equal(3, message); test.done() });

    processor.runSync(1);
};

exports['context send for loop'] = function (test) {
    var processor = mproc.createProcessor();

    function incmsg(message, context, next) { 
        test.ok(message > 0); 
        message++; 
        if (message == 3)
            next(null, message);
        else
            context.send(message);
    }

    processor.use(incmsg)
        .use(function (message) { test.equal(3, message); test.done() });

    processor.runSync(1);
};

exports['define using the arguments'] = function (test) {
    function incmsg(message, context, next) { message++; next(null, message); }
    function done(message) { test.equal(3, message); test.done(); }

    var processor = mproc.createProcessor(incmsg, incmsg, done);

    processor.runSync(1);
};
