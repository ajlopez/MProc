
var mproc = require('..');

exports['next with err throw exception'] = function (test) {
    var processor = mproc.createProcessor();

    processor.use(function (message, next) { message++; next('error'); })    

    try {
        processor.run(1);
        test.ok(null);
    }
    catch (ex) {
        test.ok(ex);
        test.equal(ex, 'error');
    }
};

exports['next with err using fail'] = function (test) {
    var processor = mproc.createProcessor();

    processor.use(function (message, next) { message++; next('error'); })
        .fail(function (err) {
            test.ok(err);
            test.equal(err, 'error');
        });
        
    processor.run(1);
};
exports['step thowing exception'] = function (test) {
    var processor = mproc.createProcessor();

    processor.use(function (message, next) { throw 'error'; })
        .fail(function (err) {
            test.ok(err);
            test.equal(err, 'error');
        });
        
    processor.run(1);
};
