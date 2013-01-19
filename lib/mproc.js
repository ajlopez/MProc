
function Processor() {
    var steps = [];

    this.use = function (step) {
        steps.push(step);
    };

    this.runSync = function (msg) {
        var nstep = 0;

        function doStep(msg) {
            if (nstep >= steps.length)
                return;
            var step = steps[nstep++];
            step(msg, null, function(err, msg) { if (!err) doStep(msg); });
        }

        doStep(msg);
    };

    this.run = function (msg) {
        var nstep = 0;

        function doStep(msg) {
            if (nstep >= steps.length)
                return;
            var step = steps[nstep++];
            step(msg, null, function(err, msg) { if (!err) process.nextTick(function () { doStep(msg); }); });
        }

        process.nextTick(function () { doStep(msg); });
    };
}

exports.createProcessor = function() { return new Processor(); };