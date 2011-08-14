var multi = require('./')(process);

var bars = [];
var progress = [];
var deltas = [];

for (var i = 0; i < 5; i++) {
    process.stdout.write('bar ' + i + ': ');
    bars.push(multi());
    deltas[i] = Math.random() * 10;
    progress.push(0);
}

console.log('\nbeep boop\n');

var pending = progress.length;
var iv = setInterval(function () {
    progress.forEach(function (p, i) {
        progress[i] += Math.random() * deltas[i];
        bars[i].percent(progress[i]);
        if (p < 100 && progress[i] >= 100) pending --;
        if (pending === 0) {
            multi.destroy();
            clearInterval(iv);
        }
    });
}, 200);
