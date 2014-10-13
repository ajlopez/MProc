
var mproc = require('../..'),
    http = require('http'),
    url = require('url');

function resolver(link) {
    var hostname = url.parse(link).hostname;
    var visited = {};

    return function (message, next) {
        var urldata = url.parse(message);

        if (urldata.hostname !== hostname)
            return;

        if (visited[message])
            return;

        visited[message] = true;

        next();
    };
}

function download(message, next) {
    var urldata = url.parse(message);

    options = {
        host: urldata.hostname,
        port: urldata.port,
        path: urldata.path,
        method: 'GET'
    };

    http.get(options, function(res) { 
            console.log('Downloading:', message);
            res.setEncoding('utf8');
            var body = '';

            res.on('data', function(data) {
                body += data;
            });

            res.on('end', function() {
                console.log('Download complete:', message);
                next(null, body);
            });
       }).on('error', function(e) {
            console.log('Url:', link);
            console.log('Error:', e.message);
            next(e);
        });
}

function harvest(message, next, context) {
    var match1 = /href=\s*"([^&"]*)"/ig;
    var match2= /href=\s*'([^&']*)'/ig;

    while ((matchdata = match1.exec(message)) !== null) {
        var link = matchdata[1];
        if (link.indexOf('http:') == 0)
            context.post(link);
    }

    while ((matchdata = match2.exec(message)) !== null) {
        var link = matchdata[1];
        if (link.indexOf('http:') == 0)
            context.post(link);
    }
}

// Process arguments

process.argv.forEach(function(arg) {
    if (arg.indexOf("http:")==0)
    {
        var processor = mproc.createProcessor();

        processor.use(resolver(arg))
            .use(download)
            .use(harvest);

        processor.run(arg);
    }
});

