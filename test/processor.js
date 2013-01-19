
var mproc = require('..');

exports['createProcessor defined'] = function (test) {
    test.ok(mproc.createProcessor);
    test.equal(typeof mproc.createProcessor, 'function');
    test.done();
};

exports['define and sync simple run'] = function (test) {
    var processor = mproc.createProcessor();

    processor.use(function (message, context, next) { message++; next(null, message); });
    processor.use(function (message) { test.equal(2, message); test.done() });

    processor.runSync(1);
};

exports['define and sync simple run with two steps'] = function (test) {
    var processor = mproc.createProcessor();

    function incmsg(message, context, next) { message++; next(null, message); }

    processor.use(incmsg);
    processor.use(incmsg);
    processor.use(function (message) { test.equal(3, message); test.done() });

    processor.runSync(1);
};
