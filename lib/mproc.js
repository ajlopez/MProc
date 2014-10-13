
function Context(processor) {
    this.post = function (message, name) {
        setImmediate(function () {
            processor.run(message, name);
        });
    };
}

function Processor() {
    var steps = [];
    var context = new Context(this);
    var named = { };
    var namedproc;
    var fnfail;

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
    
    this.fail = function (fn) {
        fnfail = fn;
        return this;
    }

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
            runStep(step, msg, context, function(err, newmsg) { 
                if (!err) { 
                    if (!newmsg) newmsg = msg; 
                    doStep(newmsg); 
                }
                else
                    doError(err);
           });
        }
        
        doStep(msg);
    };
    
    function runStep(step, msg, context, next) {
        try {
            step(msg, next, context);
        }
        catch (err) {
            next(err, null);
        }
    }
    
    function doError(err) {
        if (fnfail)
            fnfail(err);
        else
            throw err;
    }
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

