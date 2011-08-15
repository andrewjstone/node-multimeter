var net = require('net');
var http = require('http');
var multimeter = require('./');

//(function (stream) {
http.createServer(function (req, res) {
    res.setHeader('content-type', 'application/octet-stream');
    res.write('beep');
    
    var multi = multimeter(res);
    multi.charm.on('^C', process.exit);
    multi.charm.reset();
    
    var bars = [];
    var progress = [];
    var deltas = [];
    
    for (var i = 0; i < 5; i++) {
        var s = 'bar ' + i + ': \n';
        multi.write(s);
        
        var bar = multi(s.length, i + 1);
        bars.push(bar);
        
        deltas[i] = 2 + Math.random() * 8;
        progress.push(0);
    }
    
    multi.write('\nbeep boop\n');
    
    var pending = progress.length;
    var iv = setInterval(function () {
        progress.forEach(function (p, i) {
            progress[i] += Math.random() * deltas[i];
            bars[i].percent(progress[i]);
            if (p < 100 && progress[i] >= 100) pending --;
            if (pending === 0) {
                res.write('\nAll done.\n');
                res.end();
            }
        });
    }, 200);
    
    res.connection.on('end', function () {
        multi.destroy();
        clearInterval(iv);
    });
//})(process);
}).listen(8080);
