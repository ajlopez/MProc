
var mproc = require('..');

exports['define and simple run'] = function (test) {
    test.expect(1);
    var processor = mproc.createProcessor();

    processor.use(function (message, context, next) { message++; next(null, message); });
    processor.use(function (message) { test.equal(2, message); test.done() });

    processor.run(1);
};

exports['define and simple run with two steps'] = function (test) {
    test.expect(3);

    var processor = mproc.createProcessor();

    function incmsg(message, context, next) { test.ok(message > 0); message++; next(null, message); }

    processor.use(incmsg);
    processor.use(incmsg);
    processor.use(function (message) { test.equal(3, message); test.done() });

    processor.run(1);
};
