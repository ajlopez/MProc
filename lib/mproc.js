
function Context(processor) {
    this.send = function (message) {
        processor.runSync(message);
    };

    this.post = function (message) {
        processor.run(message);
    };
}

function Processor() {
    var steps = [];
    var context = new Context(this);

    this.use = function (step) {
        steps.push(step);
        return this;
    };

    this.runSync = function (msg) {
        var nstep = 0;

        function doStep(msg) {
            if (nstep >= steps.length)
                return;
            var step = steps[nstep++];
            step(msg, context, function(err, msg) { if (!err) doStep(msg); });
        }

        doStep(msg);
    };

    this.run = function (msg) {
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

exports.createProcessor = function() { return new Processor(); };