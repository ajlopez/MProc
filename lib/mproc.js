
function Context(processor) {
    this.send = function (message, name) {
        processor.runSync(message, name);
    };

    this.post = function (message, name) {
        processor.run(message, name);
    };
}

function Processor() {
    var steps = [];
    var context = new Context(this);
    var named = { };
    var namedproc;

    this.use = function (step) {
        if (namedproc)
            namedproc.use(step);
        else
            steps.push(step);

        return this;
    };

    this.name = function (name) {
        namedproc = new Processor();
        named[name] = namedproc;
        return this;
    }

    this.runSync = function (msg, name) {
        if (name) {
            named[name].runSync(msg);
            return;
        }

        var nstep = 0;

        function doStep(msg) {
            if (nstep >= steps.length)
                return;
            var step = steps[nstep++];
            step(msg, context, function(err, msg) { if (!err) doStep(msg); });
        }

        doStep(msg);
    };

    this.run = function (msg, name) {
        if (name) {
            named[name].run(msg);
            return;
        }

        var nstep = 0;

        function doStep(msg) {
            if (nstep >= steps.length)
                return;
            var step = steps[nstep++];
            step(msg, context, function(err, msg) { if (!err) process.nextTick(function () { doStep(msg); }); });
        }

        process.nextTick(function () { doStep(msg); });
    };
}

function createProcessor() {
    var processor = new Processor();
    var l = arguments.length;

    for (var k = 0; k < l; k++) {
        var arg = arguments[k];

        if (typeof arg === 'string')
            processor.name(arg);
        else
            processor.use(arg);
    }

    return processor;
}

exports.createProcessor = createProcessor;

