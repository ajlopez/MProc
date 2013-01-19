
var mproc = require('../..');

var processor = mproc.createProcessor();

processor.use(function (message, context, next) {
        if (message[0] === 1)
            console.dir(message);
        else
            next(null, message);
    })
    .use(function (message, context, next) {
        var val = message[0];
        
        if (val % 2 === 0)
            message.unshift(val / 2);

        next(null, message);
    })
    .use(function (message, context, next) {
        var val = message[0];
        
        if (val !== 1 && val % 2 !== 0)
            message.unshift(val * 3 + 1);

        context.send(message);
    });

for (var k = 1; k < 1000; k++)
    processor.runSync([k]);

