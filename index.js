var charmer = require('charm');

module.exports = function () {
    var charm = charmer.apply(null, arguments);
    charm.on('data', function (buf) {
        if (buf[0] === 3) {
            charm.destroy();
            process.exit();
        }
    });
    
    var multi = function () {
        var queue = { percent : [], ratio : [] };
        var self = {
            percent : function (p) {
                queue.percent.push(p);
            },
            ratio : function (x, y) {
                queue.ratio.push([ x, y ]);
            }
        };
        
        charm.position(function (x, y) {
            self.percent = function (p) {
                charm.push(true);
                if (p > 100) p = 100;
                
                var pf = Math.floor(p);
                var bars = Math.floor(p / 10);
                
                charm
                    .position(x, y)
                    .write('[')
                    .background('green')
                    .write(Array(bars + 1).join(' '))
                    .display('reset')
                    .write(Array(10 - bars + 1).join(' '))
                    .write('] ' + pf + ' %')
                ;
                
                charm.pop(true);
            };
            
            queue.percent.forEach(function (p) {
                self.percent(p);
            });
            
            queue.ratio.forEach(function (xy) {
                self.ratio(xy[0], xy[1]);
            });
        }).write('\r\n');
        
        return self;
    };
    
    multi.charm = charm;
    multi.destroy = charm.destroy.bind(charm);
    
    return multi;
};
