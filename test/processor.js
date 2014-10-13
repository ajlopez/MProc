
var mproc = require('..');

exports['createProcessor defined'] = function (test) {
    test.ok(mproc.createProcessor);
    test.equal(typeof mproc.createProcessor, 'function');
    test.done();
};

exports['define and sync simple run'] = function (test) {
    var processor = mproc.createProcessor();

    processor.use(function (message, next) { message++; next(null, message); })
        .use(function (message) { test.equal(2, message); test.done() });

    processor.runSync(1);
};

exports['define and sync simple run with two steps'] = function (test) {
    test.async();
    
    var processor = mproc.createProcessor();

    function incmsg(message, next) { message++; next(null, message); }

    processor.use(incmsg)
        .use(incmsg)
        .use(function (message) { test.equal(3, message); test.done() });

    processor.runSync(1);
};

exports['context send for loop'] = function (test) {
    var processor = mproc.createProcessor();

    function incmsg(message, next, context) { 
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

exports['createProcessor with arguments'] = function (test) {
    function incmsg(message, next) { message++; next(null, message); }
    function done(message) { test.equal(3, message); test.done(); }

    var processor = mproc.createProcessor(incmsg, incmsg, done);

    processor.runSync(1);
};

exports['name'] = function (test) {
    function send(message, next, context) { context.send(message, 'done'); next(null, message); }
    function incmsg(message, next) { message++; next(null, message); }
    function done(message) { test.equal(1, message); test.done(); }

    var processor = mproc.createProcessor();

    processor.use(send)
        .use(incmsg)
        .use(incmsg)
        .name("done")
        .use(done);

    processor.runSync(1);
};

exports['name in createProcessor arguments'] = function (test) {
    function send(message, next, context) { context.send(message, 'done'); next(null, message); }
    function incmsg(message, next) { message++; next(null, message); }
    function done(message) { test.equal(1, message); test.done(); }

    var processor = mproc.createProcessor(send, incmsg, incmsg, "done", done);

    processor.runSync(1);
};
